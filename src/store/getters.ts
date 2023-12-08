/*********************************************************
 ** 获取状态数据
 ** <br><br>
 ** Date: Created in 2022/9/14 11:30
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
import {PermissionComponent, Menu, UserInfo} from "../common/domain/common";
import state from "./state";

export default {
    // 获取浏览器可视部分高度
    screenHeight: (state: any): number => state.screenHeight,
    // 获取浏览器可视部分宽度
    screenWidth: (state: any): number => state.screenWidth,
    // 获取框架头部高度
    frameHeaderHeight: (state: any): number => state.frameHeaderHeight,
    // 获取框架脚部高度
    frameFooterHeight: (state: any): number => state.frameFooterHeight,
    // 获取框架sider最大宽度
    frameSiderMaxWidth: (state: any): number => state.frameSiderMaxWidth,
    // 框架内容部分头部高度
    frameContentTitleHeight: (state: any): number => state.frameContentTitleHeight,
    // 获取框架内容部分高度(浏览器可视高度-头部高度-脚部高度-内容部分头部高度)
    frameContentHeight: (state: any): number => state.screenHeight - state.frameHeaderHeight - state.frameFooterHeight - state.frameContentTitleHeight,
    // 获取框架菜单部分高度(浏览器可视高度-头部高度-脚部高度)
    frameSiderHeight: (state: any): number => state.screenHeight - state.frameHeaderHeight - state.frameFooterHeight,


    // 获取当前登录用户的菜单
    menus: (state: any): Array<Menu> => state.menus,
    // 获取用户信息
    userInfo: (state: any): UserInfo => state.userInfo,
    // 组件权限数据
    components: (state: any): Array<PermissionComponent> => state.components,


}
