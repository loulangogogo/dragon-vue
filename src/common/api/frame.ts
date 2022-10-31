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
 * 获取当前用户菜单信息
 * @param
 * @return
 * @author     :loulan
 * */
export const currentUserMenu = () => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/menu/getCurrentUserMenu`);
}


