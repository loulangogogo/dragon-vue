import ask from "../ask";

/**
 * 发送手机登陆验证码
 * @param
 * @return
 * @author     :loulan
 * */
export const sendPhoneLoginVerifyCode = (phone:number|undefined) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/phone/sendLoginVerifyCode?phone=${phone}`)
}
