import ask from "../../ask";


/**
 * 通过permission的id获取url
 * @param
 * @return
 * @author     :loulan
 * */
export const getUrlByPermissionId = (permissionId:any) => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/permission-url/getUrlByPermissionId/${permissionId}`);
}


/**
 * 插入
 * @param
 * @return
 * @author     :loulan
 * */
export const permissionUrlSave = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/permission-url/save`,data);
}

/**
 * 更新
 * @param
 * @return
 * @author     :loulan
 * */
export const permissionUrlUpdate = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/permission-url/update`,data);
}

/**
 * 根据id删除
 * @param
 * @return
 * @author     :loulan
 * */
export const permissionUrlDel = (id:number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/permission-url/delete/${id}`);
}


