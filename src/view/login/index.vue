<template>
  <div id="loginFrameDiv">
    <a-tabs :default-active-key="LoginModeEnum.account" size="large" :animation="true" @change="loginChange">
      <a-tab-pane :key="LoginModeEnum.account">
        <template #title>
          <span class="spanTitle">账号登录</span>
        </template>
        <div class="contentDiv">
          <login-account @loginSubmit="login" :loginButtonLoading="loginButtonLoading"></login-account>
        </div>
      </a-tab-pane>
      <a-tab-pane :key="LoginModeEnum.phone">
        <template #title>
          <span class="spanTitle">手机登录</span>
        </template>
        <div class="contentDiv">
          <login-phone></login-phone>
        </div>
      </a-tab-pane>
      <a-tab-pane :key="LoginModeEnum.email">
        <template #title>
          <span class="spanTitle">邮箱登录</span>
        </template>
        <div class="contentDiv">
          <login-email></login-email>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import LoginAccount from './account.vue';
import LoginPhone from './phone.vue';
import LoginEmail from './email.vue';
import * as $L from "owner-tool-js";
import {LoginData, LoginModeEnum} from "../../common/domain/login";
import {ResponseResult, ResponseStatusEnum} from "../../common/domain/response";
import {getToken} from "../../common/api/login";
import {useRouter} from "vue-router";
import {LocalStorageEnum} from "../../common/domain/storage";
import {ref} from "vue";


// 登录按钮的加载状态
const loginButtonLoading = ref(false);

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
  loginButtonLoading.value = true;
  getToken(loginData).then((res: ResponseResult) => {
    if (res.status == ResponseStatusEnum.OK) {
      $L.windowsTool.localStorageTool.set(LocalStorageEnum.token, res.data.tokenType + " " + res.data.accessToken);
      // 将token保存完成之后进行跳转
      router.push({path:"/", replace: true});
      loginButtonLoading.value = false;
    } else {
      loginButtonLoading.value = false;
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
  position: absolute;
  top: 100px;
  right: 200px;

  .spanTitle {
    font-weight: bolder;
    font-size: 16px;
  }

  .contentDiv {
    margin-top: 30px;
  }

  :deep .arco-tabs-nav-tab-list {
    margin: auto;
  }
}
</style>
