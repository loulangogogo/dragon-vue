import router from '../router/index';

/**
 * 路由全局前置守卫
 * @param       to:router即将进入的路由对象
 * @param       from:当前导航即将离开的路由
 * @return
 * @author     :loulan
 * */
router.beforeEach((to, from) => {
    if (to.path == '/') {
        return '/test/js/windows';
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
router.onError((error,to,from)=>{
    console.error("进入路由错误");
});
