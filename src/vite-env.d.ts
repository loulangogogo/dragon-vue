/// <reference types="vite/client" />

/*********************************************************
 ** 由于typescript不认识.vue文件，此处做一个声明
 ** <br><br>
 ** Date: Created in 2024/3/7 14:13
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/*********************************************************
 ** 环境变量接口的定义
 ** <br><br>
 ** Date: Created in 2024/3/7 13:53
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
interface ImportMetaEnv {
  readonly VITE_REQUEST_AUTH_PRE: string;
  readonly VITE_REQUEST_SYSTEM_PRE: string;
  readonly VITE_REQUEST_HANDLER_PRE: string;
  readonly VITE_APP_URL: string;
}
