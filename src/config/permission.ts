import router from '../router/index';
import store from "../store";
import * as $L from 'owner-tool-js';
import {LocalStorageEnum} from "../common/domain/storage";
import {generateMenuRouter} from "../router/routerMenu";

/**
 * 路由全局前置守卫
 * @param       to:router即将进入的路由对象
 * @param       from:当前导航即将离开的路由
 * @return
 * @author     :loulan
 * */
router.beforeEach(async (to, from) => {
    if (to.path != '/login') {

        // 如果token不存在就去登录页面
        if (!$L.windowsTool.localStorageTool.get(LocalStorageEnum.token)) {
            return  "/login";
        }

        // 如果菜单数据为空，那么就获取菜单并重新生成菜单路由(整个数据的获取必须在token存在，也就是登录成功之后才能进行)
        if ($L.core.isEmpty(store.getters.menus)) {
            await generateMenuRouter();
            return {...to,replace: true};
        }
    }
    return true;
});


/**
 * 路由后置钩子
 * @param       to:router即将进入的路由对象
 * @param       from:当前导航即将离开的路由
 * @param       failure:导航成功与否
 * @return
 * @author     :loulan
 * */
router.afterEach((to, from, failure) => {
    console.log("afterEach-" + to.path);
})

/**
 * Description :路由发生错误就进入到这里，会出现错误的情况如下：
 * 错误在一个路由守卫函数中被同步抛出；
 * 错误在一个路由守卫函数中通过调用 next(err) 的方式异步捕获并处理；
 * 渲染一个路由的过程中，需要尝试解析一个异步组件时发生错误（一般其实就是路由找不到对应的页面）。
 * @param       e - 错误信息
 * @return
 * @author     :loulan
 * */
router.onError((error, to, from) => {
    console.error("进入路由错误，错误信息--->"+error);
});
