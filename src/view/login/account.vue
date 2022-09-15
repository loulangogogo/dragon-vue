<template>
  <a-form :model="loginData" :rules="formRules" ref="accountFormRef" size="large">
    <a-form-item field="account" label="用户名">
      <a-input v-model="loginData.account" placeholder="请输入你的用户名……"  allow-clear/>
    </a-form-item>
    <a-form-item field="password" label="密码">
      <a-input-password v-model="loginData.password" placeholder="请输入密码……" allow-clear/>
    </a-form-item>
    <a-form-item field="captchaCode" label="验证码">
      <a-input v-model="loginData.captchaCode" placeholder="验证码……"  allow-clear/>
      <a-image src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp" height="34" width="100px" :preview="false"></a-image>
    </a-form-item>
  </a-form>
  <div align="center" style="margin-top: 35px">

    <a-button type="primary" @click="submit" size="large" style="width: 150px">登录</a-button>
  </div>
</template>

<script lang="ts" setup>

import {reactive, ref} from "vue";
import {FieldRule, Modal, ValidatedError} from "@arco-design/web-vue";
import * as $L from 'owner-tool-js';
import {getToken} from "../../common/api/login";
import {LoginMode} from "../../common/domain/login";

const accountFormRef:any = ref(null);

// 登录需要的信息
const loginData = reactive({
  account: "",
  password: "",
  mode: LoginMode.account,
  captchaUuid: "",
  captchaCode: "",
});

// 表单校验规则
const formRules:Record<string, FieldRule | FieldRule[]> = {
  account:{
    type: "string",
    required: true,
    message: "用户名不能为空"
  },
  password:{
    type: "string",
    required: true,
    message:"密码不能为空"
  },
  captchaCode:{
    type: "string",
    required: true,
    message:"验证码不能为空"
  }
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
      getToken(loginData).then((res:any)=>{
        console.warn(res);
        Modal.success({
          title: '提示',
          content: '登录成功'
        });
      })
    }
  });
}
</script>

<style scoped>

</style>
