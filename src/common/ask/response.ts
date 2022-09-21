import {AxiosResponse} from "axios";
import { Message } from '@arco-design/web-vue';

export default (response: AxiosResponse) => {
    if (response.status == 200) {
        return response.data;
    } else {
        // fixme 2022/9/21(待修改) 可以将错误信息保存到localStorage进行错误数据存储等等、
        Message.error("系统错误，请重新操作！");
        return Promise.reject(response);
    }
}
