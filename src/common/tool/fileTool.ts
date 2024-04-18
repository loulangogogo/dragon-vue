


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


