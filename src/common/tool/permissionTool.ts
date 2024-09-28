/*********************************************************
 ** 权限工具类
 ** <br><br>
 ** Date: Created in 2024/5/16 11:02
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
import {PermissionComponent} from "../domain/common";
import {useSystemStore} from "../../store";
import {core as coreTool} from "owner-tool-js";

/**
 * 判断用户是否拥有指定组件的权限
 * @param code 指定的组件代码，用于权限检查
 * @return 返回一个布尔值，表示用户是否具有对该组件的访问权限
 * @author loulan
 * */
export const hasComponent = (code: string): boolean => {
    // 从store的getters中获取权限组件列表
    const permissions: Array<PermissionComponent> = useSystemStore().components;
    // 检查权限列表是否为空，若为空则直接返回false
    if (coreTool.isEmpty(permissions)) {
        return false;
    }

    // 遍历权限列表，查找是否存在匹配的组件代码
    return permissions.some((component: PermissionComponent) => {
        return component.code == code;
    });
}
