import {AxiosRequestConfig} from "axios";
import * as $L from "owner-tool-js";
import {LocalStorageEnum} from "../domain/storage";

export default (config:AxiosRequestConfig)=>{
    if ($L.windowsTool.localStorageTool.get(LocalStorageEnum.token)) {
        // 在请求头中添加token
        config.headers = {
            Authorization: $L.windowsTool.localStorageTool.get(LocalStorageEnum.token)
        }
    }
    return config;
}
