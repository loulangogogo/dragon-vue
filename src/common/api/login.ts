import ask from "../ask";
import {LoginData} from "../domain/login";

/**
 * 登录
 * @param
 * @return
 * @author     :loulan
 * */
export const getToken = (loginData:LoginData) => {
    return ask.post(`auth/security/token?grant_type=password&client_id=DRAGON_PC&client_secret=123&username=${loginData.account}&password=${loginData.password}`,loginData)
}
