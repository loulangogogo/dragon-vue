import {AxiosRequestConfig} from "axios";
import * as $L from "owner-tool-js";
import {LocalStorageEnum} from "../domain/storage";

export default (config:AxiosRequestConfig)=>{
    if ($L.windowsTool.sessionStorageTool.get(LocalStorageEnum.token)) {
        // 想请求头中添加token
        config.headers = {
            Authorization: $L.windowsTool.sessionStorageTool.get(LocalStorageEnum.token)
        }
    }
    return config;
}
