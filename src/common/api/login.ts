import ask from "../ask";
import {LoginData} from "../domain/login";

/**
 * 登录
 * @param
 * @return
 * @author     :loulan
 * */
export const getToken = (loginData: LoginData) => {
    let extraParam = `mode=${loginData.mode}&captchaUuid=${loginData.captchaUuid}&captchaCode=${loginData.captchaCode}`;
    return ask.post(`${import.meta.env.VITE_REQUEST_AUTH_PRE}/security/token?grant_type=password&client_id=DRAGON_PC&client_secret=123&username=${loginData.account}&password=${loginData.password}&${extraParam}`)
}
