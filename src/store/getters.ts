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

    // 获取框架内容部分高度(浏览器可视高度-头部高度-脚部高度-内容部分头部高度)
    frameContentHeight: (state: any): number => state.screenHeight - state.frameHeaderHeight - state.frameFooterHeight - state.frameContentTitleHeight,
    // 获取框架菜单部分高度(浏览器可视高度-头部高度-脚部高度)
    frameSiderHeight: (state: any): number => state.screenHeight - state.frameHeaderHeight - state.frameFooterHeight,
}
