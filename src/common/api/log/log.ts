import ask from "../../ask";
import {pageQuery} from "../../domain/common";

/**
 * 分页获取日志数据
 * @param       query 查询条件何分页参数
 * @return
 * @author     :loulan
 * */
export const pageLogList = <T extends pageQuery>(query: T) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/log/pageList`, query);
}

/**
 * 添加建议反馈数据
 * @param       data: 新增数据，目前涉及到3个参数。optType，content，nt
 * @return
 * @author     :loulan
 * */
export const addFunIdea = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/log/add-fun-idea`, data);
}
