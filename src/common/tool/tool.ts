
/**
 * 获取当前变量值
 * @param
 * @return
 * @author     :loulan
 * */
export const currentEnvVal = ():any => {
    return `${import.meta.env.VITE_APP_ENV}`;
};