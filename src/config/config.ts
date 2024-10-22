// 根组件
import app from './app';
// 路由
import router from '../router/index';
// 引入权限管理配置
import './permission';
// ui组件
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';

// 阿里图标
import '/public/static/icon/ali/iconfont.css';


app.use(router)
    .use(ArcoVue)
    .use(ArcoVueIcon)
    .mount('#app');
