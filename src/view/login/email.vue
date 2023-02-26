<template>
  <a-form :model="loginData" :rules="formRules" ref="accountFormRef" size="large">
    <a-form-item field="account" label="邮箱">
      <a-input v-model="loginData.account" placeholder="请输入你的邮箱……"  allow-clear/>
    </a-form-item>
    <a-form-item field="password" label="验证码">
      <a-input v-model="loginData.password" placeholder="请输入你的验证码……"  allow-clear>
        <template #suffix>
          <a-countdown v-if="isStartCountdown"
                       :value="Date.now() + 90*1000"
                       :now="Date.now()" format="ss"
                       @finish="()=>isStartCountdown=false"
                       :value-style="{fontSize: '14px'}"/>
          <span v-else class="verifyCodeStyle" @click="sendMessageCaptcha">获取验证码</span>
        </template>
      </a-input>
    </a-form-item>
  </a-form>
  <div align="center" style="margin-top: 35px">
    <a-button type="primary" @click="submit" size="large" style="width: 150px" :loading="loginButtonLoading">登录</a-button>
  </div>
</template>

<script lang="ts" setup>

import {reactive, ref} from "vue";
import {FieldRule, Message, ValidatedError} from "@arco-design/web-vue";
import * as $L from 'owner-tool-js';
import {GrantTypeEnum} from "../../common/domain/enums";
import {sendEmailLoginVerifyCode} from "../../common/api/email";
import {ResponseResult, ResponseStatusEnum} from "../../common/domain/response";

defineProps({
  // 登录按钮的加载状态
  loginButtonLoading:{
    type: Boolean,
    required: false,
    default: false
  }
})

// 事件对象
const emits = defineEmits(['loginSubmit']);

// 表单的ref
const accountFormRef:any = ref(null);

// 获取验证码的时候需要进行倒计时，这个是倒计时的开关
const isStartCountdown = ref(false);

// 登录需要的信息
const loginData = reactive({
  account: "",
  password: "",
  grant_type: GrantTypeEnum.EMAIL,
});

// 表单校验规则
const formRules:Record<string, FieldRule | FieldRule[]> = {
  account:{
    type: "email",
    required: true,
    message: "邮箱不正确"
  },
  password:{
    type: "string",
    required: true,
    message:"验证码不能为空"
  }
}

/**
 * 发送邮箱验证码
 * @param
 * @return
 * @author     :loulan
 * */
const sendMessageCaptcha = ()=> {
  accountFormRef.value.validateField("account", async (errors: undefined | Record<string, ValidatedError>) => {
    // 当errors为undefined的时候表示校验成功没有错误
    if ($L.core.isUndefined(errors)) {
      isStartCountdown.value = true;
      const res:ResponseResult = await sendEmailLoginVerifyCode(loginData.account);
      if (res.status === ResponseStatusEnum.OK) {
        // 暂时不进行任何操作
      } else {
        isStartCountdown.value = false;
      }
    }
  });
}

/**
 * 点击登录提交数据
 * @param
 * @return
 * @author     :loulan
 * */
const submit = () => {
  accountFormRef.value.validate((errors: undefined | Record<string, ValidatedError>) => {
    // 当errors为undefined的时候表示校验成功没有错误
    if ($L.core.isUndefined(errors)) {
      emits('loginSubmit', loginData);
    }
  });
}
</script>

<style scoped>
.verifyCodeStyle{
  cursor: pointer;
}
.verifyCodeStyle:hover {
  color: blue;
}
</style>
