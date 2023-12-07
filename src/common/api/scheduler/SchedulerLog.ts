import ask from "../../ask";
import {pageQuery} from "../../domain/common";

/**
 * 分页获取定时任务日志数据
 * @param       query 查询条件何分页参数
 * @return
 * @author     :loulan
 * */
export const jobLogPageList = <T extends pageQuery>(query: T) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_SCHEDULER_PRE}/scheduler-log/pageList`, query);
}
