import ask from "../../ask";
import {pageQuery} from "../../domain/common";

/**
 * 分页获取数据
 * @param       query 查询条件何分页参数
 * @return
 * @author     :loulan
 * */
export const generateFilePageList = <T extends pageQuery>(query: T) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/generate-file/pageList`, query);
}