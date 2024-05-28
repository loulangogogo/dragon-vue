import {createApp} from 'vue';
import App from '../App.vue';
import HasComponent from "../common/directive/hasComponent";

const dragonApp = createApp(App);

// 添加指令
dragonApp.directive("has-component", HasComponent);

export default dragonApp;