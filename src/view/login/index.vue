<template>
  <div id="loginFrameDiv">
    <a-tabs :default-active-key="LoginMode.account" size="large" :animation="true" @change="loginChange">
      <a-tab-pane :key="LoginMode.account">
        <template #title>
          <span class="spanTitle">账号登录</span>
        </template>
        <div class="contentDiv">
          <login-account></login-account>
        </div>
      </a-tab-pane>
      <a-tab-pane :key="LoginMode.phone">
        <template #title>
          <span class="spanTitle">手机登录</span>
        </template>
        <div class="contentDiv">
          <login-phone></login-phone>
        </div>
      </a-tab-pane>
      <a-tab-pane :key="LoginMode.email">
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
import loginAccount from './account.vue';
import loginPhone from './phone.vue';
import loginEmail from './email.vue';
import {LoginMode} from "../../common/domain/login";


/**
 * 当登录方式发生变化的时候
 * @param
 * @return
 * @author     :loulan
 * */
const loginChange = (key: string|number) => {
  console.error(key);
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
