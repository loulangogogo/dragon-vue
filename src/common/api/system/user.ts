import ask from "../../ask";
import {pageQuery} from "../../domain/common";

/**
 * 分页获取用户数据
 * @param       query 查询条件何分页参数
 * @return
 * @author     :loulan
 * */
export const pageUserList = <T extends pageQuery>(query: T) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/user/pageUserList`, query);
}

/**
 * 分页查询当前用户部门及下级用户
 * @param       query 查询条件何分页参数
 * @return
 * @author     :loulan
 * */
export const pageCurrentUserNextDeptUserList = <T extends pageQuery>(query: T) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/user/pageCurrentUserNextDeptUserList`, query);
}

/**
 * 插入
 * @param
 * @return
 * @author     :loulan
 * */
export const userSave = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/user/save`,data);
}

/**
 * 更新
 * @param
 * @return
 * @author     :loulan
 * */
export const userUpdate = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/user/update`,data);
}

/**
 * 根据id删除
 * @param
 * @return
 * @author     :loulan
 * */
export const userDel = (id:number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/user/delete/${id}`);
}

/**
 * 当前用户绑定微信
 * @param
 * @return
 * @author     :loulan
 * */
export const currentUserBindingWechat = (ticket:string)=>{
    // mode=30，表示通过微信公众号的方式进行解绑
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/user/currentUserBindWechat?key=${ticket}&mode=30`);
}

/**
 * 当前用户解除绑定微信
 * @param
 * @return
 * @author     :loulan
 * */
export const currentUserUnbindingWechat = (ticket:string)=>{
    // mode=30，表示通过微信公众号的方式进行解绑
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/user/currentUserUnbindWechat?key=${ticket}&mode=30`);
}

/**
 * 当前用户绑定邮箱
 * @param
 * @return
 * @author     :loulan
 * */
export const currentUserBindingEmail = (data:any)=>{
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/user/currentUserBindingEmail`,data);
}

/**
 * 当前用户解除绑定邮箱
 * @param
 * @return
 * @author     :loulan
 * */
export const currentUserUnbindingEmail = (data:any)=>{
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/user/currentUserUnbindingEmail`,data);
}

/**
 * 当前用户绑定手机
 * @param
 * @return
 * @author     :loulan
 * */
export const currentUserBindingPhone = (data:any)=>{
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/user/currentUserBindingPhone`,data);
}

/**
 * 当前用户解除绑定手机
 * @param
 * @return
 * @author     :loulan
 * */
export const currentUserUnbindingPhone = (data:any)=>{
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/user/currentUserUnbindingPhone`,data);
}

/**
 * 修改当前用户密码
 * @param
 * @return
 * @author     :loulan
 * */
export const fixCurrentuserPassword = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/user/fixCurrentuserPassword`,data);
}
