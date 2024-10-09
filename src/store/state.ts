import {Menu, PermissionComponent, UserInfo} from "../common/domain/common";

/*********************************************************
 ** 存储状态数据
 ** <br><br>
 ** Date: Created in 2022/9/14 11:30
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export default <{
    loadingSuccess: boolean,

    screenHeight: number,
    screenWidth: number,
    frameHeaderHeight: number,
    frameFooterHeight: number,
    frameSiderMaxWidth: number,
    frameContentTitleHeight: number,

    menus: Array<Menu>,
    userInfo: UserInfo,
    components: Array<PermissionComponent>
}>{
    loadingSuccess: false,       // 项目是否加载完成(由路由后置守卫设置)

    screenHeight: 0,            // 浏览器可使内容高度
    screenWidth: 0,             // 浏览器可视内容宽度
    frameHeaderHeight: 50,      // 框架头部高度
    frameFooterHeight: 0,       // 框架脚部高度
    frameSiderMaxWidth: 300,    // 框架菜单栏部分最大宽度
    frameContentTitleHeight: 40,// 框架内容部分头部高度

    menus: [],                   // 当前用户的菜单
    userInfo: {},               // 当前用户信息
    components: [],              // 当前用户组件权限数据
};
