import ask from "../../ask";
import {pageQuery} from "../../domain/common";

/**
 * 分页获取字典数据
 * @param       query 查询条件何分页参数
 * @return
 * @author     :loulan
 * */
export const pageDictList = <T extends pageQuery>(query: T) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/dict/pageList`, query);
}

/**
 * 插入
 * @param
 * @return
 * @author     :loulan
 * */
export const dictSave = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/dict/save`,data);
}

/**
 * 更新
 * @param
 * @return
 * @author     :loulan
 * */
export const dictUpdate = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/dict/update`,data);
}

/**
 * 根据id删除
 * @param
 * @return
 * @author     :loulan
 * */
export const dictDel = (id:number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/dict/delete/${id}`);
}
