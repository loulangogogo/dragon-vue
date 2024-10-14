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

    // let extraParam = `captchaUuid=${loginData.captchaUuid}&captchaCode=${loginData.captchaCode}`;
    // return ask.post(`${import.meta.env.VITE_REQUEST_AUTH_PRE}/security/token?grant_type=${loginData.grant_type}&client_id=DRAGON_PC&client_secret=123&username=${loginData.account}&password=${loginData.password}&${extraParam}`)
    const urlSearchParams:URLSearchParams = new URLSearchParams({
        grant_type: loginData.grant_type?.toString(),
        client_id: "DRAGON_PC",
        client_secret: "undefined",
        username: loginData.account?.toString()!,
        password: loginData.password?.toString()!,
        captchaUuid: loginData.captchaUuid?.toString()!,
        captchaCode: loginData.captchaCode?.toString()!,
    });
    return ask.post(`${import.meta.env.VITE_REQUEST_AUTH_PRE}/security/token?${urlSearchParams.toString()}`,{},{
        headers:{
            isNoResponseErrorMsg: GrantTypeEnum.WECHAT_SCAN == loginData.grant_type,
        }
    })
}

/**
 * 获取微信登陆二维码
 * @param
 * @return
 * @author     :loulan
 * */
export const getWechatQrcode = (type:number)=>{
    return ask.get(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/wechat/getGzhQrcode/${type}`)
}


