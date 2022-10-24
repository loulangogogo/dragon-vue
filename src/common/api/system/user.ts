import ask from "../../ask";
import {pageQuery} from "../../domain/common";

/**
 * 分页获取用户数据
 * @param       query 查询条件何分页参数
 * @return
 * @author     :loulan
 * */
export const pageUserList = <T extends pageQuery>(query: T) => {
    return ask.post(`/system/user/pageUserList`, query);
}

/**
 * 插入
 * @param
 * @return
 * @author     :loulan
 * */
export const userSave = (data:any) => {
    return ask.put(`/system/user/save`,data);
}

/**
 * 更新
 * @param
 * @return
 * @author     :loulan
 * */
export const userUpdate = (data:any) => {
    return ask.put(`/system/user/update`,data);
}

/**
 * 根据id删除
 * @param
 * @return
 * @author     :loulan
 * */
export const userDel = (id:number) => {
    return ask.delete(`/system/user/delete/${id}`);
}
