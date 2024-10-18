import ask from "../ask";
import {LoginData} from "../domain/login";
import {GrantTypeEnum} from "../domain/enums";
import {DragonNotice} from "../domain/component";
import {ResponseResult, ResponseStatusEnum} from "../domain/response";

/**
 * 登录
 * @param
 * @return
 * @author     :loulan
 * */
export const getToken = (loginData: LoginData) => {

    const urlSearchParams:URLSearchParams = new URLSearchParams({
        grant_type: loginData.grant_type?.toString(),
        client_id: "DRAGON_PC",
        client_secret: "undefined",
    });

    // 根据登陆类型设置参数
    switch (loginData.grant_type) {
        case GrantTypeEnum.PASSWORD:
            urlSearchParams.append("username", loginData.account?.toString()!);
            urlSearchParams.append("password", loginData.password?.toString()!);
            urlSearchParams.append("captchaUuid", loginData.captchaUuid?.toString()!);
            urlSearchParams.append("captchaCode", loginData.captchaCode?.toString()!);
            break;
        case GrantTypeEnum.WECHAT_SCAN:
            urlSearchParams.append("code", loginData.account?.toString()!);
            break;
        case GrantTypeEnum.PHONE:
            urlSearchParams.append("username", loginData.account?.toString()!);
            urlSearchParams.append("password", loginData.password?.toString()!);
            break;
        case GrantTypeEnum.EMAIL:
            urlSearchParams.append("username", loginData.account?.toString()!);
            urlSearchParams.append("password", loginData.password?.toString()!);
            break;
        default:
            DragonNotice.error("不支持的登陆类型！");
            return <ResponseResult>{
                status: ResponseStatusEnum.FAIT,
                msg: "不支持的登陆类型！"
            }
    }


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


