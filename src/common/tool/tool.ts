import {EnvEnum} from "../domain/enums";

/**
 * 获取当前环境的变量值
 * @returns {EnvEnum} 返回当前环境的枚举值，可能是开发环境(DEV)，生产环境(PROD)，或是错误环境(ERROR)
 * @author loulan
 */
export const currentEnvVal = (): EnvEnum => {
    // 根据当前环境模式判断返回对应的枚举值
    if (import.meta.env.MODE == EnvEnum.DEV) {
        return EnvEnum.DEV;
    } else if (import.meta.env.MODE == EnvEnum.PROD) {
        return EnvEnum.PROD;
    } else {
        return EnvEnum.ERROR;
    }
};
