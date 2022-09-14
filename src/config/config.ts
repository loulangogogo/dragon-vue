// 根组件
import app from './app';
// 路由
import router from '../router/index';
// 状态管理器
import store from '../store/index';
// 引入权限管理配置
// import './permission';
// ui组件
import ArcoVue from '@arco-design/web-vue';
import '@arco-themes/vue-owner/css/arco.css';


app.use(router)
    .use(store)
    .use(ArcoVue)
    .mount('#app');
