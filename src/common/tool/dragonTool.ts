import {getDictAndEnum} from "../api/common";
import {ResponseResult, ResponseStatusEnum} from "../domain/response";

/**
 * 获取枚举类型的数据
 * @param       className 全限定类名
 * @return
 * @author     :loulan
 * */
export const getEnum = async (className:string)=>{
    const res:ResponseResult = await getDictAndEnum(20, [className]);
    if (res.status === ResponseStatusEnum.OK) {
        return res.data[className];
    } else {
        return undefined;
    }
}

/**
 * 获取枚举类型的数据
 * @param       className 全限定类名数组
 * @return
 * @author     :loulan
 * */
export const getEnums = async (classNames:Array<string>)=>{
    const res:ResponseResult = await getDictAndEnum(20, classNames);
    if (res.status === ResponseStatusEnum.OK) {
        return res.data;
    } else {
        return undefined;
    }
}
