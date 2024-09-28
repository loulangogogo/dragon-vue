import {createApp} from 'vue';
import App from '../App.vue';
import HasComponent from "../common/directive/hasComponent";
// 状态管理器 pinia。状态管理器放在这个地方是因为很多地方直接使用，必须提前引入并使用，否则会报错
import { createPinia } from 'pinia'

const dragonApp = createApp(App).use(createPinia())

// 添加指令
dragonApp.directive("has-component", HasComponent);

export default dragonApp;