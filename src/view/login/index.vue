<template>
  <div id="loginBackDiv">
    <div id="loginFrameDiv">
      <a-tabs :default-active-key="currentTabPane" size="large"  @change="(val)=>currentTabPane=val">
        <a-tab-pane :key="LoginModeEnum.account">
          <template #title>
            <span class="spanTitle">账号登录</span>
          </template>
          <div class="contentDiv">
            <login-account ref="loginAccountRef" v-if="currentTabPane === LoginModeEnum.account"
                           @loginSubmit="login" :loginButtonLoading="loginButtonLoading"></login-account>
          </div>
        </a-tab-pane>
        <a-tab-pane :key="LoginModeEnum.wechat">
          <template #title>
            <span class="spanTitle">微信扫码</span>
          </template>
          <div class="contentDiv">
            <login-wechat ref="loginWechatRef" v-if="currentTabPane === LoginModeEnum.wechat"
                          @loginSubmit="login" ></login-wechat>
          </div>
        </a-tab-pane>
        <a-tab-pane :key="LoginModeEnum.phone">
          <template #title>
            <span class="spanTitle">手机登录</span>
          </template>
          <div class="contentDiv">
            <login-phone ref="loginPhoneRef" v-if="currentTabPane === LoginModeEnum.phone"
                         @loginSubmit="login" :loginButtonLoading="loginButtonLoading"></login-phone>
          </div>
        </a-tab-pane>
        <a-tab-pane :key="LoginModeEnum.email">
          <template #title>
            <span class="spanTitle">邮箱登录</span>
          </template>
          <div class="contentDiv">
            <login-email ref="loginEmailRef" v-if="currentTabPane === LoginModeEnum.email"
                         @loginSubmit="login" :loginButtonLoading="loginButtonLoading"></login-email>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LoginAccount from './account.vue';
import LoginPhone from './phone.vue';
import LoginEmail from './email.vue';
import LoginWechat from './wechat.vue';
import * as $L from "owner-tool-js";
import {LoginData, LoginModeEnum} from "../../common/domain/login";
import {ResponseResult, ResponseStatusEnum} from "../../common/domain/response";
import {getToken} from "../../common/api/login";
import {useRouter} from "vue-router";
import {LocalStorageEnum} from "../../common/domain/storage";
import {onMounted, ref} from "vue";
import {GrantTypeEnum} from "../../common/domain/enums";

const loginAccountRef = ref();
const loginPhoneRef = ref();
const loginEmailRef = ref();

const currentTabPane = ref();
onMounted(()=>{
  // 指定刚进入的pane
  currentTabPane.value = LoginModeEnum.account;
})

// 登录按钮的加载状态
const loginButtonLoading = ref(false);

let router = useRouter();

/**
 * 当登录方式发生变化的时候
 * @param
 * @return
 * @author     :loulan
 * */
const loginChange = (key: string | number) => {
  console.error(key);
}

/**
 * 点击登录提交数据
 * @param
 * @return
 * @author     :loulan
 * */
const login = async (loginData: LoginData) => {
  loginButtonLoading.value = true;
  const res: ResponseResult = await getToken(loginData);
  if (res.status == ResponseStatusEnum.OK) {
    $L.windowsTool.localStorageTool.set(LocalStorageEnum.token, res.data.tokenType + " " + res.data.accessToken);
    // 将token保存完成之后进行跳转
    router.push({path: "/", replace: true});
    // loginButtonLoading.value = false;
  } else {
    loginButtonLoading.value = false;
    if (GrantTypeEnum.PASSWORD === loginData.grant_type) {
      loginAccountRef.value.loginError(res);
    }
  }
}
</script>

<style scoped lang="scss">
#loginBackDiv {
  //background: url('/static/img/loginBK.jpg') no-repeat;
  background-color: #5f5f60;
  background-size: cover;
  width: 100%;
  height: 100%;
}

#loginFrameDiv {
  width: 400px;
  height: 400px;
  background-color: rgb(255, 255, 255, 0.5);
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
