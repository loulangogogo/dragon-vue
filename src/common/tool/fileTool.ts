import {uploadMultipartFile, uploadMultipartFileEnd, uploadMultipartFileStart} from "../api/file";
import {ResponseResult, ResponseStatusEnum} from "../domain/response";


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
 * 异步进行multipart文件上传。
 * @param file 需要上传的文件对象。
 * @returns 返回一个Promise，成功时携带上传结果数据，失败时拒绝并返回错误信息。
 */
export const multipartUpload = async (file:File):Promise<any> => {

    // 文件的总大小
    const totalSize:number = file.size;
    // 文件名称
    const fileName:string = file.name;

    // 设置初始的uploadId，这个数据由后段返回
    let uploadId:string = '';
    // 设置分片的大小，也是设置一个初始化，实际数据由后段返回
    let chunkSize:number  = 1 * 1024 * 1024;
    // 调用说明开始准备上传
    const resStart: ResponseResult = await uploadMultipartFileStart(fileName, totalSize, false);
    if (resStart.status == ResponseStatusEnum.OK) {
        uploadId = resStart.data.uploadId;
        chunkSize = resStart.data.multipatSize;
    } else {
        return new Promise((resolve, reject) => {
            reject(resStart.msg);
        });
    }


    // 循环上传分片
    // 计算分片数量
    const totalChunks:number = Math.ceil(totalSize / chunkSize);
    for (let i:number = 0; i < totalChunks; i++) {
        // 计算分片的起始和结束位置
        const start:number = i * chunkSize;
        // 计算分片的结束位置
        const end:number = start + chunkSize >= totalSize ? totalSize : start + chunkSize;
        // 创建分片
        const chunk:Blob = file.slice(start, end);

        // 分片数据的包装
        const formData:FormData = new FormData();
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

    // 调用说明分片上传结束，并获取上传文件地址等等
    const resEnd: ResponseResult = await uploadMultipartFileEnd(uploadId);
    if (resEnd.status == ResponseStatusEnum.OK) {
        return new Promise((resolve, reject) => {
            return resolve(resEnd.data);
        })
    } else {
        return new Promise((resolve, reject) => {
            reject(resEnd.msg);
        });
    }
}



// const modalReturn:ModalReturn = Modal.open({
//     content: () => h(Progress, {
//             type: "circle",
//             percent: 0.8,
//
//         },
//     ),
//     width: "auto",
//     footer: false,
//     closable: false,
//     maskClosable: false,
//     modalStyle:{
//         backgroundColor: "rgba(255,255,255,0.8)"
//     }
// });


