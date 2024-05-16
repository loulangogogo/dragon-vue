/*********************************************************
 ** 自定义的指令配置
 ** <br><br>
 ** Date: Created in 2022/10/21 14:41
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
import app from './app';
import HasComponent from "../common/directive/hasComponent";

// 添加指令
app.directive("has-component", HasComponent);

app.directive("test",{
    created(el, binding, vnode, prevVnode) {

    },
    beforeMount(el, binding, vnode, prevVnode) {

    },
    mounted(el, binding, vnode, prevVnode) {

    },
    beforeUpdate(el, binding, vnode, prevVnode) {

    },
    updated(el, binding, vnode, prevVnode) {

    },
    beforeUnmount(el, binding, vnode, prevVnode) {

    },
    unmounted(el, binding, vnode, prevVnode) {

    },
})
