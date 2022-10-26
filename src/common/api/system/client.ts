import ask from "../../ask";
import {pageQuery} from "../../domain/common";

/**
 * 分页获取客户端数据
 * @param       query 查询条件何分页参数
 * @return
 * @author     :loulan
 * */
export const pageClientList = <T extends pageQuery>(query: T) => {
    return ask.post(`/system/client/pageList`, query);
}

/**
 * 插入
 * @param
 * @return
 * @author     :loulan
 * */
export const clientSave = (data:any) => {
    return ask.put(`/system/client/save`,data);
}

/**
 * 更新
 * @param
 * @return
 * @author     :loulan
 * */
export const clientUpdate = (data:any) => {
    return ask.put(`/system/client/update`,data);
}

/**
 * 根据id删除
 * @param
 * @return
 * @author     :loulan
 * */
export const clientDel = (id:number) => {
    return ask.delete(`/system/client/delete/${id}`);
}
