import {AxiosRequestConfig} from "axios";
import * as $L from "owner-tool-js";
import {LocalStorageEnum} from "../domain/storage";

export default (config:AxiosRequestConfig)=>{
    if ($L.windowsTool.localStorageTool.get(LocalStorageEnum.token)) {
        // 在请求头中添加token
        config.headers = {
            ...config.headers,
            Authorization: $L.windowsTool.localStorageTool.get(LocalStorageEnum.token)
        }
    }

    // 所有请求都需要添加客户端key
    config.headers={
        ...config.headers,
        "Client-Key": "f70d4cb1588d451dba70ae35ab2a3af5",
    }
    return config;
}
