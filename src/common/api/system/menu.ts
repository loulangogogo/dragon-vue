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
 * 获取当前用户的的全部菜单，包括各种状态和客户端的菜单
 * 目前这个接口是用来下级用户进行授权使用的
 * @param
 * @return
 * @author     :loulan
 * */
export const queryCurrentUserAllMenu = () => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/menu/queryCurrentUserAllMenu`);
}

/**
 * 通过菜单的id获取当前菜单的下的权限信息
 * @param
 * @return
 * @author     :loulan
 * */
export const getPermissionByMenuId = (menuId:number) => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/permission/getPermissionByMenuId/${menuId}`);
}

/**
 * 通过当前用户菜单的id获取当前用户的权限数据
 * @param
 * @return
 * @author     :loulan
 * */
export const getCurrentUserPermissionByCurrentUserMenuId = (menuId:number,type:number) => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/permission/getCurrentUserPermissionByCurrentUserMenuId/${menuId}?type=${type}`);
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


