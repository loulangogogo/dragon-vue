import router from '../router/index';
import store from "../store";
import {core as coreTool,windowsTool} from 'owner-tool-js';
import {LocalStorageEnum} from "../common/domain/storage";
import {generateMenuRouter,currentUserComponentPermission} from "../router/routerMenu";
import {ResponseResult, ResponseStatusEnum} from "../common/domain/response";
import {currentUserInfo} from "../common/api/frame";

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
        if (!windowsTool.localStorageTool.get(LocalStorageEnum.token)) {
            return  "/login";
        }

        // 如果菜单数据为空，那么就获取菜单并重新生成菜单路由(整个数据的获取必须在token存在，也就是登录成功之后才能进行)
        if (coreTool.isEmpty(store.getters.menus)) {
            await currentUserComponentPermission();
            await generateMenuRouter();
            return {...to,replace: true};
        }

        // 如果当前用户数据不存在，那么就需要去获取当前用户的数据，（因为各个地方阶段都在使用当前用户的信息）
        if (coreTool.isNotExist(store.getters.userInfo?.id)) {
            const res:ResponseResult = await currentUserInfo();
            if (res.status == ResponseStatusEnum.OK && res.data) {
                store.commit("setUserInfo", res.data);
            } else {
                // 获取当前用户信息失败，理论上因该退出重新登录的
                console.error("获取当前用户信息错误。");
                return false;
            }
            return {...to,replace: true}; /*重新路由*/
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

    // 设置项目加载状态已经完成
    store.commit("setLoadingSuccess", true);
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
