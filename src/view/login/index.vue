<template>
  <div id="loginBackDiv">
    <div id="loginFrameDiv">
      <div class="lgoinHeaderDiv">
          <h2>登&emsp;&emsp;录</h2>
      </div>
      <div>
        <div v-if="currentTabPane === LoginModeEnum.account" class="contentDiv">
          <login-account ref="loginAccountRef" @loginSubmit="login" :loginButtonLoading="loginButtonLoading"></login-account>
        </div>
        <div v-if="currentTabPane === LoginModeEnum.wechat" class="contentDiv">
          <login-wechat ref="loginWechatRef" @loginSubmit="login"></login-wechat>
        </div>
        <div v-if="currentTabPane === LoginModeEnum.phone"  class="contentDiv">
          <login-phone ref="loginPhoneRef" @loginSubmit="login" :loginButtonLoading="loginButtonLoading"></login-phone>
        </div>
        <div v-if="currentTabPane === LoginModeEnum.email" @loginSubmit="login" class="contentDiv">
          <login-email ref="loginEmailRef" @loginSubmit="login" :loginButtonLoading="loginButtonLoading"></login-email>
        </div>
      </div>
      <div class="loginOptionDiv">
        <div class="loginOptionSpanDiv">
          <hr style="width: 100%;">
          <span style="white-space:nowrap;">登录选项</span>
          <hr style="width:100%">
        </div>
        <div class="loginOptionIconDiv">
          <icon-user size="30" class="loginOptionicon" 
          :style="{color: currentTabPane === LoginModeEnum.account?'green':''}"
          @click="()=>currentTabPane=LoginModeEnum.account"/>
          <icon-wechat size="30" class="loginOptionicon" 
          :style="{color: currentTabPane === LoginModeEnum.wechat?'green':''}"
          @click="()=>currentTabPane=LoginModeEnum.wechat"/>
          <icon-mobile size="30" class="loginOptionicon" 
          :style="{color: currentTabPane === LoginModeEnum.phone?'green':''}"
          @click="()=>currentTabPane=LoginModeEnum.phone"/>
          <icon-email size="30" class="loginOptionicon" 
          :style="{color: currentTabPane === LoginModeEnum.email?'green':''}"
          @click="()=>currentTabPane=LoginModeEnum.email"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LoginAccount from './account.vue';
import LoginPhone from './phone.vue';
import LoginEmail from './email.vue';
import LoginWechat from './wechat.vue';
import * as $L from "owner-tool-js";
import { LoginData, LoginModeEnum } from "../../common/domain/login";
import { ResponseResult, ResponseStatusEnum } from "../../common/domain/response";
import { getToken } from "../../common/api/login";
import { useRouter } from "vue-router";
import { LocalStorageEnum } from "../../common/domain/storage";
import { onMounted, ref } from "vue";
import { GrantTypeEnum } from "../../common/domain/enums";

const loginAccountRef = ref();
const loginPhoneRef = ref();
const loginEmailRef = ref();

const currentTabPane = ref();
onMounted(() => {
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
    router.push({ path: "/", replace: true });
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
  position: relative;
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

  .contentDiv {
    margin-top: 30px;
  }

  :deep .arco-tabs-nav-tab-list {
    margin: auto;
  }
}

.lgoinHeaderDiv{
  width: 100%;
  display: flex;
  justify-content: center;
}

// 底部图标选项
.loginOptionDiv {
  width: 100%;
  position: absolute;
  bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .loginOptionSpanDiv {
    padding: 10px;
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #5f5f60;
  }

  .loginOptionIconDiv {
    width: 100%;
    display: flex;
    justify-content: center;

    .loginOptionicon {
      margin: 0px 20px;
      cursor: pointer;
    }
  }
}
</style>
