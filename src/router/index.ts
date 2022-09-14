import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: "/login",
        name: "login",
        component: () => import("@/view/login/index.vue")
    },
    {
        path: "/",
        name: "frame",
        component: () => import("@/view/frame/index.vue")
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;
