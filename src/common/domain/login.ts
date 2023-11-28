import {GrantTypeEnum} from "./enums";

/*********************************************************
 ** 登录需要的信息
 ** <br><br>
 ** Date: Created in 2022/9/15 14:33
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export interface LoginData {
    // 必填项，可以是账号，手机好，邮箱
    account?: string | number;
    // 必填，可以是密码，手机验证码，邮箱验证码
    password?: string;
    // 登录方式
    grant_type: GrantTypeEnum;
    captchaUuid?: string;
    captchaCode?: string;
}

/*********************************************************
 ** 登录方式枚举，账号登录，手机登录，邮箱登录
 ** <br><br>
 ** Date: Created in 2022/9/15 15:27
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export enum LoginModeEnum{
    account = 1,
    phone = 2,
    email = 3,
    wechat = 4
}
