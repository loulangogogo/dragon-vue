import ask from "../ask";
import {LoginData} from "../domain/login";

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


