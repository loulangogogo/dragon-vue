import ask from "../ask";

/**
 * 获取所有的角色类型
 * @param
 * @return
 * @author     :loulan
 * */
export const getRoleType = () => {
    return ask.get(`system/role/getRoleType`);
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
