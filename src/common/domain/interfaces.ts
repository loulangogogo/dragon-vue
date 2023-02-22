/*********************************************************
 ** 获取微信二维码的时候返回的二维码对象
 ** <br><br>
 ** Date: Created in 2023/2/22 23:06
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export interface Qrcode{
    ticket?: string,
    url?: string,
    expire_seconds?: number
}
