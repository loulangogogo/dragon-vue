import ask from "../ask";

/**
 * 生成图片验证码
 * @param
 * @return
 * @author     :loulan
 * */
export const generatePicCaptcha = () => {
    return ask.get(`${import.meta.env.VITE_REQUEST_AUTH_PRE}/verify/generatePicCaptcha`);
}
