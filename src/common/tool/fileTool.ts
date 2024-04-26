import {
    downloadByteFileByPath,
    downloadFileRangeStart,
    downloadRangeFileByPath,
    uploadFile,
    uploadMultipartFile,
    uploadMultipartFileEnd,
    uploadMultipartFileStart
} from "../api/file";
import {ResponseResult, ResponseStatusEnum} from "../domain/response";
import {ref, Ref} from "vue";
import {core as coreTool} from "owner-tool-js";
import {DragonMessage} from "../domain/component";


/**
 * 计算给定文件的哈希值。
 *
 * @param optionFile 需要计算哈希值的文件对象。
 * @param algorithm 指定使用的哈希算法，默认为'SHA-256'。
 * @return 返回一个Promise，该Promise解析为计算出的哈希值的十六进制字符串。
 * @exception 如果文件读取失败或哈希计算失败，Promise将被拒绝，并返回相应的错误。
 * @author loulan
 * */
export const calculateHash = (optionFile: File, algorithm: string = 'SHA-256'): Promise<string> => {
    return new Promise((resolve, reject) => {
        // 验证传入的文件对象是否有效
        if (!optionFile || !(optionFile instanceof File)) {
            reject(new Error('Invalid file object provided.'));
            return;
        }

        const reader: FileReader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
            // 文件读取成功后的处理逻辑
            const buffer: ArrayBuffer = event.target?.result as ArrayBuffer;
            // 使用指定算法计算哈希值
            crypto.subtle.digest(algorithm, buffer)
                .then(hash => {
                    // 将计算出的哈希值转换为十六进制字符串
                    const hashArray: Uint8Array = new Uint8Array(hash);
                    const hashHex: string = hashArray.map((b: any) => b.toString(16).padStart(2, '0')).join('');
                    resolve(hashHex);
                })
                .catch(error => reject(new Error('Hash calculation failed: ' + error.message)));
        };

        reader.onerror = () => reject(new Error('Failed to read the file: ' + reader.error?.message));
        reader.readAsArrayBuffer(optionFile); // 开始读取文件
    });
}

/**
 * 上传文件的函数
 * 【POST /file/upload-multipart-file/*】需要这个权限
 * @param file 要上传的文件对象，类型为File
 * @param isPrivate 是否为私有文件，默认为false，即公开
 * @return 返回一个Promise对象，成功时resolve返回响应数据，失败时reject返回错误信息
 * @author loulan
 * */
export const upload = (file: File, isPrivate: boolean = false): Promise<any> => {

    if (file.size > 20000000) {
        DragonMessage.warning("文件不能超过20M");
        return new Promise<boolean>((reject: any) => reject("文件不能超过20M"));
    }

    return new Promise((resolve, reject) => {
        // 准备上传数据，将文件包装在formData中
        const formData: FormData = new FormData();
        formData.append("file", file);
        // 执行文件上传操作
        uploadFile(isPrivate, formData).then((res: ResponseResult) => {
            if (res.status === ResponseStatusEnum.OK) {
                // 上传成功，解决Promise
                resolve(res.data);
            } else {
                // 上传失败，拒绝Promise
                reject(res.msg);
            }
        });
    })
}


/**
 * 异步进行multipart分片上传文件。
 * 【POST /file/uploadMultipartFile-start】需要这个权限
 * 【PUT /file/uploadMultipartFile】需要这个权限
 * 【GET /file/uploadMultipartFile-end】需要这个权限
 * @param file 要上传的文件对象。
 * @param isPrivate 是否为私有文件，默认为false，即公开
 * @param precent 上传进度的ref对象，默认为0。用于实时更新上传进度。
 * @returns 返回一个Promise，成功时携带上传结果数据，失败时拒绝并返回错误信息。
 */
export const multipartUpload = async (file: File, isPrivate: boolean = false, precent: Ref<number> = ref(0)): Promise<any> => {
    // 文件的总大小
    const totalSize: number = file.size;
    // 文件名称
    const fileName: string = file.name;


    /************************初始化分片上传**************************/
        // 设置初始的uploadId，这个数据由后段返回
    let uploadId: string = '';
    // 设置分片的大小，也是设置一个初始化，实际数据由后段返回
    let chunkSize: number = 1 * 1024 * 1024;
    // 调用说明开始准备上传
    const resStart: ResponseResult = await uploadMultipartFileStart(fileName, totalSize, isPrivate);
    if (resStart.status == ResponseStatusEnum.OK) {
        uploadId = resStart.data.uploadId;
        chunkSize = resStart.data.multipatSize;
    } else {
        return new Promise((resolve, reject) => {
            reject(resStart.msg);
        });
    }


    /************************循环上传分片**************************/
        // 计算分片数量
    const totalChunks: number = Math.ceil(totalSize / chunkSize);
    for (let i: number = 0; i < totalChunks; i++) {
        // 显示上传进度
        precent.value = i / totalChunks * 100;

        // 计算分片的起始和结束位置
        const start: number = i * chunkSize;
        // 计算分片的结束位置
        const end: number = start + chunkSize >= totalSize ? totalSize : start + chunkSize;
        // 创建分片，分片包含start但是不包含end
        const chunk: Blob = file.slice(start, end);

        // 分片数据的包装
        const formData: FormData = new FormData();
        formData.append("file", chunk);
        // 分片上传
        const res: ResponseResult = await uploadMultipartFile(uploadId, formData, i);
        if (res.status != ResponseStatusEnum.OK) {
            // 如果发生了错误就不用上传了
            return new Promise((resolve, reject) => {
                reject(resStart.msg);
            });
        }
    }

    /************************调用说明分片上传结束，并获取上传文件地址等等**************************/
    const resEnd: ResponseResult = await uploadMultipartFileEnd(uploadId);
    if (resEnd.status == ResponseStatusEnum.OK) {
        // 上传完成，修改上传进度为100%
        precent.value = 100;
        return new Promise((resolve, reject) => {
            return resolve(resEnd.data);
        })
    } else {
        return new Promise((resolve, reject) => {
            reject(resEnd.msg);
        });
    }
}

/**
 * 多分片下载文件的函数。
 * 【GET /file/download-range-file-start】需要这个权限
 * 【POST /file/download-range-file-by-path】需要这个权限
 *
 * @param path 文件的下载路径，不能为空。
 * @param precent 用于显示下载进度的引用，默认值为0。
 * @return 返回一个Promise，成功时解析为下载文件的URL，失败时reject错误信息。
 * @author loulan
 */
export const multipartDownload = async (path: string, precent: Ref<number> = ref(0)): Promise<any> => {
    if (coreTool.isEmpty(path)) {
        return new Promise((resolve, reject) => {
            reject("文件的路径不能为空");
        });
    }

    /************************初始化分片下载**************************/
    let totalSize: number = 0;
    // 设置分片的大小，也是设置一个初始化，实际数据由后段返回
    let chunkSize: number = 1 * 1024 * 1024;
    const resStart: ResponseResult = await downloadFileRangeStart(path);
    if (resStart.status == ResponseStatusEnum.OK) {
        totalSize = resStart.data.size;
        chunkSize = resStart.data.multipatSize;
    } else {
        return new Promise((resolve, reject) => {
            reject(resStart.msg);
        });
    }

    /************************循环分片下载**************************/
        // 计算分片数量
    const totalChunks: number = Math.ceil(totalSize / chunkSize);
    const blobs: Array<Uint8Array> = [];
    for (let i: number = 0; i < totalChunks; i++) {
        // 显示下载进度
        precent.value = i / totalChunks * 100;

        // 计算分片的起始和结束位置
        const start: number = i * chunkSize;
        // 计算分片的结束位置
        const end: number = start + chunkSize >= totalSize ? totalSize : start + chunkSize;

        // 分片下载，下载的是start到end整个块，所以这里需要-1，因为快是从0开始的
        const res: ResponseResult = await downloadRangeFileByPath(path, start, end - 1);
        if (res.status == ResponseStatusEnum.OK) {
            /**
             * 将基于base64编码的字符串转换为Blob数组。
             * 参数:
             *   res - 包含base64编码数据的对象。
             * 返回值:
             *   一个Blob数组，包含转换后的二进制数据。
             */
            const binaryString: String = atob(res.data);
            const u8Array: Uint8Array = new Uint8Array(binaryString.length);
            // 循环遍历二进制字符串的每个字符，将其转换为Uint8Array中的数值
            for (let i: number = 0; i < binaryString.length; i++) {
                u8Array[i] = binaryString.charCodeAt(i);
            }
            blobs.push(u8Array);
        } else {
            // 如果发生了错误就不用下载了
            return new Promise((resolve, reject) => {
                reject(resStart.msg);
            });
        }
    }

    /************************下载完成，生成下载的地址**************************/
    const fileBlob: Blob = new Blob(blobs, {type: 'application/octet-stream'});
    const url: string = window.URL.createObjectURL(fileBlob);
    precent.value = 100;
    return new Promise((resolve, reject) => {
        resolve(url);
    })
};

/**
 * 下载文件
 * 【GET /file/download-file-byte-by-path】需要这个权限
 * @param path 需要下载的文件路径
 * @return 返回一个Promise，成功时解析为文件的URL，失败时reject错误信息
 * @exception 当下载失败时，会抛出异常
 * @author loulan
 * */
export const download = (path: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        // 通过路径下载字节文件
        downloadByteFileByPath(path).then((res: ResponseResult) => {
            if (res.status == ResponseStatusEnum.OK) {
                // 将下载的base64数据转换为二进制字符串
                const binaryString: String = atob(res.data);
                // 创建Uint8Array，用于存储转换后的二进制数据
                const u8Array: Uint8Array = new Uint8Array(binaryString.length);
                // 遍历二进制字符串，转换为Uint8Array中的数值
                for (let i: number = 0; i < binaryString.length; i++) {
                    u8Array[i] = binaryString.charCodeAt(i);
                }
                // 创建Blob对象，表示二进制大型对象
                const fileBlob: Blob = new Blob([u8Array], {type: 'application/octet-stream'});
                // 创建可访问的文件URL
                const url: string = window.URL.createObjectURL(fileBlob);
                resolve(url);
            } else {
                // 下载失败，返回错误信息
                reject(res.msg);
            }
        });
    });
}


/**
 * 通过给定的URL下载文件。
 * @param url 文件的URL地址。
 * @param fileName 下载后文件的命名，默认为空字符串。如果为空，则使用URL中提供的文件名。
 * @return 无返回值。
 * @exception 当URL无效或网络问题时，可能会抛出异常。
 * @author loulan
 * */
export const downloadByUrl = (url: string, fileName: string=""): void =>{
    // 创建一个隐藏的<a>元素
    let link:any = document.createElement('a');
    link.style.display = 'none';
    link.href = url; // 设置链接地址
    link.setAttribute('download',fileName); // 设置下载后的文件名
    document.body.appendChild(link); // 将链接添加到页面中
    link.click(); // 模拟点击开始下载
    document.body.removeChild(link); // 下载完成后移除链接
    window.URL.revokeObjectURL(url); // 释放URL对象
}





