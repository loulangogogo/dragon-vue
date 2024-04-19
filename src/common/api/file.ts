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
 *
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
export const uploadMultipartFileStart = (fileName:string,size:number,isPrivate:boolean) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/file/uploadMultipartFile-start`,{
        fileName,
        size,
        isPrivate
    })
}

/**
 *
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
export const uploadMultipartFile = (uploadId:string,file:any,partNum:number) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/file/uploadMultipartFile?uploadId=${uploadId}&partNum=${partNum}`,file)
}

/**
 * 
 * @param       
 * @return
 * @exception  
 * @author     :loulan
 * */
export const uploadMultipartFileEnd = (uploadId:string) => {
    return ask.get(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/file/uploadMultipartFile-end?uploadId=${uploadId}`)
}