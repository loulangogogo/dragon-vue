import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
import frame from '../view/frame/index.vue';


const routes: Array<RouteRecordRaw> = [
    {
        path: "/login",
        name: "login",
        component: () => import("../view/login/index.vue")
    },
    {
        path: "/",
        name: "frame",
        component: frame,
        children:[
            {
                path: "/",
                name: "首页",
                component: () => import("../view/home/index.vue")
            },{
                path: "/user-center",
                name: "个人中心",
                component: () => import("../view/frame/header/user-center.vue")
            },
        ]
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;
