import ask from "../ask";
import {LoginData} from "../domain/login";
import {GrantTypeEnum} from "../domain/enums";

/**
 * 登录
 * @param
 * @return
 * @author     :loulan
 * */
export const getToken = (loginData: LoginData) => {
    let extraParam = `captchaUuid=${loginData.captchaUuid}&captchaCode=${loginData.captchaCode}`;
    return ask.post(`${import.meta.env.VITE_REQUEST_AUTH_PRE}/security/token?grant_type=${loginData.grant_type}&client_id=DRAGON_PC&client_secret=123&username=${loginData.account}&password=${loginData.password}&ticket=${loginData.ticket}&${extraParam}`)
}

/**
 * 获取微信登陆二维码
 * @param
 * @return
 * @author     :loulan
 * */
export const getWechatQrcode = (type:number)=>{
    return ask.get(`${import.meta.env.VITE_REQUEST_AUTH_PRE}/wechat/getQrcode/${type}`)
}

/*********************************************************
 ** 发送手机登陆验证码
 ** <br><br>
 ** Date: Created in 2023/2/26 10:21
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export const sendPhoneLoginVerifyCode = (phone:number|undefined) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/phone/sendLoginVerifyCode?phone=${phone}`)
}

/*********************************************************
 ** 发送邮箱登陆验证码
 ** <br><br>
 ** Date: Created in 2023/2/26 10:21
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export const sendEmailLoginVerifyCode = (email:string|undefined) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/email/sendLoginVerifyCode?email=${email}`)
}
