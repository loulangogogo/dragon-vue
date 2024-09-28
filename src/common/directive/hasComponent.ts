/*********************************************************
 ** 指令用于判断是否拥有组件权限
 ** <br><br>
 ** Date: Created in 2023/12/8 15:48
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
// 状态管理器
import {useSystemStore} from '../../store';
import {PermissionComponent} from "../domain/common";

export default {
    mounted(el: any, binding: any, vnode: any, prevVnode: any) {
        const {value} = binding
        // 获取所有权限数据
        const permissions: Array<PermissionComponent> = useSystemStore().components;

        let hasPermissions: boolean = false;
        if (value && value instanceof Array && value.length > 0) {
            hasPermissions = permissions.some((component: PermissionComponent) => {
                return value.includes(component.code);
            })
        } else if (value) {
            hasPermissions = permissions.some((component: PermissionComponent) => {
                return value == component.code;
            })
        } else {
            throw new Error(`请设置组件权限标签值`)
        }

        if (!hasPermissions) {
            el.parentNode?.removeChild(el)
        }
    }
}
