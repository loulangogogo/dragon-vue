/*********************************************************
 ** 动态菜单路由
 ** <br><br>
 ** Date: Created in 2022/9/20 11:34
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/

/*这个的导入主要是为了区分出来路由视图的嵌套，是一部分路径跳转到指定的路由下面*/
import frame from '../view/frame/index.vue';
import store from "../store";
import router from "./index";
import {RouteRecordRaw,} from "vue-router";
import {Menu} from "../common/domain/common";
import {currentUserMenu} from "../common/api/frame";
import {ResponseResult, ResponseStatusEnum} from "../common/domain/response";

/**
 * Description :创建当前用户的路由
 * @param
 * @return
 * @author     :loulan
 * */
const createrMenuRouter = (menus:Array<Menu>):RouteRecordRaw => {
    /*框架下动态路由对象，将路由对象添加到children中，就只显示在框架内容部分（是动态路由对象集合的一个）*/
    const dynamicRouter:RouteRecordRaw = {
        path: "/",
        name: "dynamic-frame",
        component: frame, //指定到这个组件下面的路由上
        children: []
    }

    // 遍历这个菜单
    for (const menu of menus) {
        // 将菜单类型为menu的用作路由，dirt只是下拉文件夹(10 menu, 20 dirt)
        if (menu.type == 10) {
            // 定义一个路由对象
            const routerObj:RouteRecordRaw = {
                path: menu.code + "-" + menu.id,
                name: menu.name,
                /* @vite-ignore */
                component: () => import('../' + menu.path),
                meta:{
                    keepAlive: menu.keepAlive
                }
            };
            // 将这个路由对象添加到动态路由中
            dynamicRouter.children.push(routerObj);
        }
    }
    // 返回这个路由集合
    return dynamicRouter;
}

/**
 * 生成菜单路由
 * @param
 * @return
 * @author     :loulan
 * */
export const generateMenuRouter = async ()=>{
    const res:ResponseResult = await currentUserMenu();
    if (res.status == ResponseStatusEnum.OK && res.data) {
        const menus: Array<Menu> = res.data;
        store.commit("setMenus", menus);
        let menuRouter:RouteRecordRaw = createrMenuRouter(menus);
        router.addRoute(menuRouter);
    } else {
        console.error("获取菜单错误。");
    }
}
