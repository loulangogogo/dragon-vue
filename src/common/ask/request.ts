import {AxiosRequestConfig} from "axios";
import * as $L from "owner-tool-js";
import {SessionStorageEnum} from "../domain/storage";

export default (config:AxiosRequestConfig)=>{
    if ($L.windowsTool.sessionStorageTool.get(SessionStorageEnum.token)) {
        // 想请求头中添加token
        config.headers = {
            Authorization: $L.windowsTool.sessionStorageTool.get(SessionStorageEnum.token)
        }
    }
    return config;
}
