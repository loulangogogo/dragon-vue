import ask from "../ask";

/**
 * 生成图片验证码
 * @param
 * @return
 * @author     :loulan
 * */
export const generatePicCaptcha = () => {
    return ask.get(`/auth/verify/generatePicCaptcha`);
}
