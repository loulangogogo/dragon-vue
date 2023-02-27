import ask from "../ask";

/**
 * 发送当前用户解绑手机的验证码
 * @param
 * @return
 * @author     :loulan
 * */
export const sendPhoneCurrentUserUnbindingVerifyCode = () => {
    return ask.put(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/phone/sendCurrentUserUnbindingVerifyCode`)
}

/**
 * 发送手机的验证码
 * @param
 * @return
 * @author     :loulan
 * */
export const sendPhoneVerifyCode = (phone:string|undefined,type:number) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/phone/sendVerifyCode?phone=${phone}&type=${type}`)
}

/**
 * 发送手机登陆验证码
 * @param
 * @return
 * @author     :loulan
 * */
export const sendPhoneLoginVerifyCode = (phone:number|undefined) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/phone/sendLoginVerifyCode?phone=${phone}`)
}
