import ask from "../../ask";

/**
 * 获取所有的菜单
 * @param
 * @return
 * @author     :loulan
 * */
export const getAllMenu = () => {
    return ask.get(`/system/menu/getAllMenu`);
}

/**
 * 通过菜单的id获取当前菜单的下的权限信息
 * @param
 * @return
 * @author     :loulan
 * */
export const getPermissionByMenuId = (menuId:number,type:number=NaN) => {
    return ask.get(`/system/permission/getPermissionByMenuId/${menuId}?type=${type}`);
}

/**
 * 菜单的插入
 * @param
 * @return
 * @author     :loulan
 * */
export const save = (data:any) => {
    return ask.put(`/system/menu/save`,data);
}

/**
 * 菜单的更新
 * @param
 * @return
 * @author     :loulan
 * */
export const update = (data:any) => {
    return ask.put(`/system/menu/update`,data);
}


