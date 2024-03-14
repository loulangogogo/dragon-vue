import {EnvEnum} from "../domain/enums";

/**
 * 获取当前变量值
 * @param
 * @return
 * @author     :loulan
 * */
export const currentEnvVal = (): EnvEnum => {
    if (import.meta.env.MODE == EnvEnum.DEV) {
        return EnvEnum.DEV;
    } else if (import.meta.env.MODE == EnvEnum.PROD) {
        return EnvEnum.PROD;
    } else {
        return EnvEnum.ERROR;
    }
};