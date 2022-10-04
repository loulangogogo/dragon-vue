import ask from "../../ask";

/**
 * 获取所有的角色类型
 * @param
 * @return
 * @author     :loulan
 * */
export const getRoleType = () => {
    return ask.get(`system/roleType/getRoleType`);
}

/**
 * 根据角色类型获取角色数据
 * @param
 * @return
 * @author     :loulan
 * */
export const getRoleByType = (roleTypeId:number) => {
    return ask.get(`system/role/getRoleByType/${roleTypeId}`);
}

/**
 * 角色类型的插入
 * @param
 * @return
 * @author     :loulan
 * */
export const roleTypeSave = (data:any) => {
    return ask.put(`/system/roleType/save`,data);
}

/**
 * 角色类型的更新
 * @param
 * @return
 * @author     :loulan
 * */
export const roleTypeUpdate = (data:any) => {
    return ask.put(`/system/roleType/update`,data);
}

/**
 * 根据id删除角色类型
 * @param
 * @return
 * @author     :loulan
 * */
export const roleTypeDel = (id:number) => {
    return ask.delete(`/system/roleType/delete/${id}`);
}

/**
 * 角色的插入
 * @param
 * @return
 * @author     :loulan
 * */
export const roleSave = (data:any) => {
    return ask.put(`/system/role/save`,data);
}

/**
 * 角色的更新
 * @param
 * @return
 * @author     :loulan
 * */
export const roleUpdate = (data:any) => {
    return ask.put(`/system/role/update`,data);
}

/**
 * 根据id删除角色
 * @param
 * @return
 * @author     :loulan
 * */
export const roleDel = (id:number) => {
    return ask.delete(`/system/role/delete/${id}`);
}
