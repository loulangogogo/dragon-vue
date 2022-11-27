import ask from "../../ask";
import {pageQuery} from "../../domain/common";

/**
 * 分页获取数据
 * @param       query 查询条件何分页参数
 * @return
 * @author     :loulan
 * */
export const pageExeList = <T extends pageQuery>(query: T) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/exe/pageList`, query);
}

/**
 * 插入
 * @param
 * @return
 * @author     :loulan
 * */
export const exeSave = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/exe/save`,data);
}

/**
 * 更新
 * @param
 * @return
 * @author     :loulan
 * */
export const exeUpdate = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/exe/update`,data);
}

/**
 * 根据id删除
 * @param
 * @return
 * @author     :loulan
 * */
export const exeDel = (id:number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/exe/delete/${id}`);
}
