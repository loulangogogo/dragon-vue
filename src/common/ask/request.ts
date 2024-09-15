import {AxiosRequestConfig, InternalAxiosRequestConfig} from "axios";
import {windowsTool} from "owner-tool-js";
import {LocalStorageEnum} from "../domain/storage";

export default (config: InternalAxiosRequestConfig)=>{
    if (windowsTool.localStorageTool.get(LocalStorageEnum.token)) {
        // 在请求头中添加token
        config.headers.Authorization = windowsTool.localStorageTool.get(LocalStorageEnum.token);
        // config.headers = {
        //     ...config.headers,
        //     Authorization: windowsTool.localStorageTool.get(LocalStorageEnum.token)
        // }
    }
    return config;
}
