import ask from "../ask";

/**
 * 获取当前用户信息
 * @param
 * @return
 * @author     :loulan
 * */
export const currentUserInfo = () => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/user/currentUserInfo`);
}

/**
 * 注销当前用户
 * @param
 * @return
 * @author     :loulan
 * */
export const unregisterCurrentUser = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/register-user/unregister`,data);
}

/**
 * 修改当前用户信息
 * @param
 * @return
 * @author     :loulan
 * */
export const currentUserInfoUpdate = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/user/currentUserInfoUpdate`,data);
}



/**
 * 获取当前用户菜单信息
 * @param
 * @return
 * @author     :loulan
 * */
export const currentUserMenu = () => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/menu/getCurrentUserMenu`);
}

/**
 * 获取当前用户组件权限数据
 * @param
 * @return
 * @author     :loulan
 * */
export const currentUserComponent = () => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/permission/getCurrentUserComponent`);
}


