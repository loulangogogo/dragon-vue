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