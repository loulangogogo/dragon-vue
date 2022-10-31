import ask from "../../ask";

/**
 * 获取所有的菜单
 * @param
 * @return
 * @author     :loulan
 * */
export const getAllMenu = () => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/menu/getAllMenu`);
}

/**
 * 通过菜单的id获取当前菜单的下的权限信息
 * @param
 * @return
 * @author     :loulan
 * */
export const getPermissionByMenuId = (menuId:number,type:number=NaN) => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/permission/getPermissionByMenuId/${menuId}?type=${type}`);
}

/**
 * 菜单的插入
 * @param
 * @return
 * @author     :loulan
 * */
export const menuSave = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/menu/save`,data);
}

/**
 * 菜单的更新
 * @param
 * @return
 * @author     :loulan
 * */
export const menuUpdate = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/menu/update`,data);
}

/**
 * 根据菜单的id删除菜单
 * @param
 * @return
 * @author     :loulan
 * */
export const menuDel = (id:number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/menu/delete/${id}`);
}

/**
 * 插入
 * @param
 * @return
 * @author     :loulan
 * */
export const permissionSave = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/permission/save`,data);
}

/**
 * 更新
 * @param
 * @return
 * @author     :loulan
 * */
export const permissionUpdate = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/permission/update`,data);
}

/**
 * 根据id删除
 * @param
 * @return
 * @author     :loulan
 * */
export const permissionDel = (id:number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/permission/delete/${id}`);
}


