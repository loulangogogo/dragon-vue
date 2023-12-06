import {Modal, ModalConfig, Space,Notification,Message } from '@arco-design/web-vue';
import {h} from "vue";
import {IconInfoCircleFill} from '@arco-design/web-vue/es/icon';

/**
 * 确认框
 * @param
 * @return
 * @author     :loulan
 * */
export const dragonConfirm = (config: ModalConfig) => {
    return new Promise((resolve, reject) => {
        Modal.confirm({
            title: () => h(Space, {}, ()=>[
                h(IconInfoCircleFill, {
                    style:{
                        "font-weight": "bolder",
                        "font-size": "25px",
                        "color": "blue"
                    }
                }),
                h('span', {
                    style: {
                        "font-weight": "bolder"
                    }
                }, config.title)
            ]),
            content: config.content,
            simple: true,
            titleAlign: "start",
            mask: true,
            maskClosable: false,
            alignCenter: true,
            onOk: () => {
                resolve(true);
            },
            onCancel:() => {
                reject(false);
            }
        });
    })
}

/*********************************************************
 ** 通知类型
 ** <br><br>
 ** Date: Created in 2022/9/30 16:46
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export namespace DragonNotice{
    export const success = (msg:string)=>{
        Notification.success(msg)
    }
    export const error = (msg:string)=>{
        Notification.error(msg)
    }
    export const warning = (msg:string)=>{
        Notification.warning(msg)
    }
    export const info = (msg:string)=>{
        Notification.info(msg)
    }
}

/*********************************************************
 ** 信息提示
 ** <br><br>
 ** Date: Created in 2022/10/2 17:20
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export namespace DragonMessage{
    export const success = (msg:string)=>{
        Message.success(msg)
    }
    export const error = (msg:string)=>{
        Message.error(msg)
    }
    export const warning = (msg:string)=>{
        Message.warning(msg)
    }
    export const info = (msg:string)=>{
        Message.info(msg)
    }
}
