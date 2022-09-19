<template>
  <a-form :model="loginData" :rules="formRules" ref="accountFormRef" size="large">
    <a-form-item field="account" label="手机号">
      <a-input-number v-model="loginData.account" placeholder="请输入你的手机号……" >
        <template #prepend>
          +86
        </template>
      </a-input-number>
    </a-form-item>
    <a-form-item field="password" label="验证码">
      <a-input v-model="loginData.password" placeholder="请输入你的验证码……"  allow-clear/>
      <a-button type="primary" status="success" @click="sendMessageCaptcha">
        短信验证码
      </a-button>
    </a-form-item>
  </a-form>
  <div align="center" style="margin-top: 35px">
    <a-button type="primary" @click="submit" size="large" style="width: 150px">登录</a-button>
  </div>
</template>

<script lang="ts" setup>

import {reactive, ref} from "vue";
import {FieldRule, ValidatedError,Message} from "@arco-design/web-vue";
import * as $L from 'owner-tool-js';
import {LoginModeEnum} from "../../common/domain/login";

const accountFormRef:any = ref(null);

// 登录需要的信息
const loginData = reactive({
  account: undefined,
  password: undefined,
  mode: LoginModeEnum.phone,
});

// 表单校验规则
const formRules:Record<string, FieldRule | FieldRule[]> = {
  account:{
    type: "string",
    minLength: 11,
    maxLength: 11,

    message: "手机号码不正确"
  },
  password:{
    type: "string",
    required: true,
    message:"验证码不能为空"
  }
}

/**
 * 发送短信验证码
 * @param
 * @return
 * @author     :loulan
 * */
const sendMessageCaptcha = ()=> {
  accountFormRef.value.validateField("account",(errors: undefined | Record<string, ValidatedError>) => {
    // 当errors为undefined的时候表示校验成功没有错误
    if ($L.core.isUndefined(errors)) {
      Message.error("当前功能正在开发中。");
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
      Message.error("当前功能正在开发中。");
    }
  });
}
</script>

<style scoped>
:deep .arco-input-suffix{
  display: none;
}
</style>
