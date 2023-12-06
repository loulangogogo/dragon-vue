import ask from "../../ask";
import {pageQuery} from "../../domain/common";

/**
 * 分页获取定时任务数据
 * @param       query 查询条件何分页参数
 * @return
 * @author     :loulan
 * */
export const jobPageList = <T extends pageQuery>(query: T) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_SCHEDULER_PRE}/scheduler-job/pageList`, query);
}

/**
 * 插入
 * @param
 * @return
 * @author     :loulan
 * */
export const jobSave = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SCHEDULER_PRE}/scheduler-job/save`,data);
}

/**
 * 更新
 * @param
 * @return
 * @author     :loulan
 * */
export const jobUpdate = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SCHEDULER_PRE}/scheduler-job/update`,data);
}

/**
 * 修改状态
 * @param
 * @return
 * @author     :loulan
 * */
export const jobChangeStatus = (id:number,status:number) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SCHEDULER_PRE}/scheduler-job/changeStatus?id=${id}&status=${status}`);
}

/**
 * 根据id删除
 * @param
 * @return
 * @author     :loulan
 * */
export const jobDel = (id:number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SCHEDULER_PRE}/scheduler-job/delete/${id}`);
}
