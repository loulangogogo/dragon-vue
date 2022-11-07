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

/**
 * 获取字典或枚举类型数据
 * @param       type 获取数据的类型，10表示获取字典数据，20表示获取枚举类型数据
 * @param       typeOrclassNames 如何查询字段这个传递的是字典类型，如果查询的是枚举这个传递的是全限定类名
 * @return
 * @author     :loulan
 * */
export const getDictAndEnum = (type:number,typeOrclassNames:Array<string>)=>{
    return ask.post(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/common/getDictAndEnum/${type}`, typeOrclassNames);
}
