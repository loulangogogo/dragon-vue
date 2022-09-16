<template>
  <div id="loginFrameDiv">
    <a-tabs :default-active-key="LoginModeEnum.account" size="large" :animation="true" @change="loginChange">
      <a-tab-pane :key="LoginModeEnum.account">
        <template #title>
          <span class="spanTitle">账号登录</span>
        </template>
        <div class="contentDiv">
          <login-account @loginSubmit="login"></login-account>
        </div>
      </a-tab-pane>
      <a-tab-pane :key="LoginModeEnum.phone">
        <template #title>
          <span class="spanTitle">手机登录</span>
        </template>
        <div class="contentDiv">
          <login-phone @loginSubmit="login"></login-phone>
        </div>
      </a-tab-pane>
      <a-tab-pane :key="LoginModeEnum.email">
        <template #title>
          <span class="spanTitle">邮箱登录</span>
        </template>
        <div class="contentDiv">
          <login-email @loginSubmit="login"></login-email>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import loginAccount from './account.vue';
import loginPhone from './phone.vue';
import loginEmail from './email.vue';
import * as $L from "_owner-tool-js@2.0.3@owner-tool-js";
import {LoginData, LoginModeEnum} from "../../common/domain/login";
import {ResponseResult, ResponseStatusEnum} from "../../common/domain/response";
import {getToken} from "../../common/api/login";
import {useRouter} from "vue-router";
import {SessionStorageEnum} from "../../common/domain/storage";


let router = useRouter();

/**
 * 当登录方式发生变化的时候
 * @param
 * @return
 * @author     :loulan
 * */
const loginChange = (key: string|number) => {
  console.error(key);
}

/**
 * 点击登录提交数据
 * @param
 * @return
 * @author     :loulan
 * */
const login = (loginData:LoginData) => {
  getToken(loginData).then((res: ResponseResult) => {
    if (res.status == ResponseStatusEnum.OK) {
      $L.windowsTool.sessionStorageTool.set(SessionStorageEnum.token, res.data.tokenType+" "+res.data.accessToken);
      router.push("/");
    }
  })
}
</script>

<style scoped lang="scss">
#loginFrameDiv {
  width: 400px;
  height: 400px;
  background-color: rgba(44, 239, 14, 0.2);
  border-radius: 10px;
  padding: 10px;
  position: relative;
  top: 100px;
  left: 200px;

  .spanTitle {
    font-weight: bolder;
    font-size: 16px;
  }

  .contentDiv {
    margin-top: 30px;
  }

  ::v-deep .arco-tabs-nav-tab-list {
    margin: auto;
  }
}
</style>
