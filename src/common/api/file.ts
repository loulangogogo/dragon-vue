import ask from "../ask";

/**
 * 上传文件
 * @param
 * @return
 * @author     :loulan
 * */
export const uploadFile = (isPrivate:boolean,file:any) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/file/upload-multipart-file/${isPrivate}`,file)
}

/**
 * 上传图片
 * @param
 * @return
 * @author     :loulan
 * */
export const uploadImage = (isPrivate:boolean,file:any) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/file/upload-multipart-image${isPrivate}`,file)
}

/**
 * 根据文件路径下载文件
 *
 * @param path 文件路径，类型为字符串
 * @return 返回一个请求Promise，用于下载文件
 * @author loulan
 * */
export const downloadFileByPath = (path:string) => {
    // 使用import.meta.env获取环境变量，并构造请求URL，发起下载文件的请求
    return ask.get(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/file/download-file-by-Path?path=${path}`)
}


/**
 * 开始上传多个文件的起始部分
 * @param fileName 要上传的文件名
 * @param size 文件大小
 * @param isPrivate 是否为私有文件
 * @return 返回请求的结果
 * @author loulan
 */
export const uploadMultipartFileStart = (fileName:string,size:number,isPrivate:boolean) => {
    // 发起POST请求到指定的URL，携带文件名、大小和是否私有的信息
    return ask.post(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/file/uploadMultipartFile-start`,{
        fileName,
        size,
        isPrivate
    })
}


/**
 * 上传多个文件的部分
 *
 * @param uploadId 上传任务的唯一标识符，类型为 string
 * @param file 要上传的文件，类型为 any，可以根据实际需求调整
 * @param partNum 文件的分块编号，用于断点续传，类型为 number
 * @return 返回上传结果的响应，具体类型依赖于 ask.put 方法的返回类型
 * @author loulan
 */
export const uploadMultipartFile = (uploadId:string,file:any,partNum:number) => {
    // 使用 ask.put 方法上传文件的特定部分
    return ask.put(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/file/uploadMultipartFile?uploadId=${uploadId}&partNum=${partNum}`,file)
}



/**
 * 结束上传多部分文件的请求。
 *
 * @param uploadId {string} 上传任务的唯一标识符。
 * @returns 返回一个Promise对象，它解析为请求的响应。
 */
export const uploadMultipartFileEnd = (uploadId:string) => {
    // 使用import.meta.env获取环境变量，并构造请求URL，发起结束上传的请求
    return ask.get(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/file/uploadMultipartFile-end?uploadId=${uploadId}`)
}
