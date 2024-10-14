import {AxiosResponse} from "axios";
import {Message, Modal} from '@arco-design/web-vue';
import {ResponseResult, ResponseStatusEnum} from "../domain/response";
import router from "../../router";

export default (response: AxiosResponse) => {
    if (response.status === 200) {
        const res: ResponseResult = response.data;
        const isNoResponseErrorMsg:boolean = response.config?.headers?.isNoResponseErrorMsg;

        if (res.status === ResponseStatusEnum.TOKEN_CHECK_ERROR) {
            //如果是token错误,如果可以的话最好记录错误信息
            Modal.error({
                title: "错误提示",
                titleAlign: "start",
                content: "您当前登录已经失效，是否重新登录？",
                maskClosable: false,
                okButtonProps: {

                },
                onOk: () => {
                    router.push("/login")
                }
            });
            return Promise.reject(response);
        } else if (res.status === ResponseStatusEnum.FAIT && !isNoResponseErrorMsg) {
            Modal.info({
                title: "提示信息",
                titleAlign: "start",
                maskClosable: false,
                content: "" + res.msg,
            });
        }
        return response.data;
    } else {
        // fixme 2022/9/21(待修改) 可以将错误信息保存到localStorage进行错误数据存储等等、
        Message.error("系统错误，请重新操作！");
        return Promise.reject(response);
    }
}
