import ask from "../ask";

/**
 * 发送当前用户解绑邮件的验证码
 * @param
 * @return
 * @author     :loulan
 * */
export const sendEmailCurrentUserUnbindingVerifyCode = () => {
    return ask.put(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/email/sendCurrentUserUnbindingVerifyCode`)
}

/**
 * 发送当前用户邮件的验证码
 * @param   type 消息类型
 * @return
 * @author     :loulan
 * */
export const sendEmailCurrentUserVerifyCode = (type:number) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/email/sendCurrentUserVerifyCode?type=${type}`)
}

/**
 * 发送邮件的验证码
 * @param
 * @return
 * @author     :loulan
 * */
export const sendEmailVerifyCode = (email:string|undefined,type:number) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/email/sendVerifyCode?email=${email}&type=${type}`)
}

/**
 * 发送邮件登陆验证码
 * @param
 * @return
 * @author     :loulan
 * */
export const sendEmailLoginVerifyCode = (email:string|undefined) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/email/sendLoginVerifyCode?email=${email}`)
}
