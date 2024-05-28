// 根组件
import app from './app';
// 路由
import router from '../router/index';
// 状态管理器
import store from '../store/index';
// 引入权限管理配置
import './permission';
// ui组件
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-themes/vue-owner/css/arco.css';

// 阿里图标
import '/public/static/icon/ali/iconfont.css';


app.use(router)
    .use(store)
    .use(ArcoVue)
    .use(ArcoVueIcon)
    .mount('#app');
