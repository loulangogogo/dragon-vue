import ask from "../../ask";
import {pageQuery} from "../../domain/common";

/**
 * 分页获取字典数据
 * @param       query 查询条件何分页参数
 * @return
 * @author     :loulan
 * */
export const dictTypePageList = <T extends pageQuery>(query: T) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/dict-type/pageList`, query);
}

/**
 * 插入
 * @param
 * @return
 * @author     :loulan
 * */
export const dictTypeSave = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/dict-type/save`,data);
}

/**
 * 更新
 * @param
 * @return
 * @author     :loulan
 * */
export const dictTypeUpdate = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/dict-type/update`,data);
}

/**
 * 根据id删除
 * @param
 * @return
 * @author     :loulan
 * */
export const dictTypeDel = (id:number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/dict-type/delete/${id}`);
}
