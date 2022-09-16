<template>
  <a-form :model="loginData" :rules="formRules" ref="accountFormRef" size="large">
    <a-form-item field="account" label="用户名">
      <a-input v-model="loginData.account" placeholder="请输入你的用户名……" allow-clear/>
    </a-form-item>
    <a-form-item field="password" label="密码">
      <a-input-password v-model="loginData.password" placeholder="请输入密码……" allow-clear/>
    </a-form-item>
    <a-form-item field="captchaCode" label="验证码">
      <a-input v-model="loginData.captchaCode" placeholder="验证码……" allow-clear/>
      <a-image :src="loginData.captchaUrl" height="34" width="100px" :preview="false" @click="getCaptcha"></a-image>
    </a-form-item>
  </a-form>
  <div align="center" style="margin-top: 35px">
    <a-button type="primary" @click="submit" size="large" style="width: 150px">登录</a-button>
  </div>
</template>

<script lang="ts" setup>

import {onMounted, reactive, ref} from "vue";
import {FieldRule, Modal, ValidatedError} from "@arco-design/web-vue";
import * as $L from 'owner-tool-js';
import {LoginModeEnum} from "../../common/domain/login";
import {generatePicCaptcha} from "../../common/api/common";
import {ResponseResult, ResponseStatusEnum} from "../../common/domain/response";

// 事件对象
const emit = defineEmits(["loginSubmit"]);

// 表单ref
const accountFormRef: any = ref(null);

// 登录需要的信息
const loginData = reactive({
  account: "",
  password: "",
  mode: LoginModeEnum.account,
  captchaUuid: "",
  captchaCode: "",
  captchaUrl: ""
});

// 表单校验规则
const formRules: Record<string, FieldRule | FieldRule[]> = {
  account: {
    type: "string",
    required: true,
    message: "用户名不能为空"
  },
  password: {
    type: "string",
    required: true,
    message: "密码不能为空"
  },
  // fixme 2022/9/16(待修改)   开发期间暂时不添加验证码的校验
/*  captchaCode: {
    type: "string",
    required: true,
    message: "验证码不能为空"
  }*/
}

/**
 * 切换获取验证码图片
 * @param
 * @return
 * @author     :loulan
 * */
const getCaptcha = () => {
  generatePicCaptcha().then((res: ResponseResult) => {
    if (res.status == ResponseStatusEnum.OK) {
      const data = res.data;
      loginData.captchaUrl = data.url;
      loginData.captchaUuid = data.captchaUuid;
    }
  })
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
      emit("loginSubmit", loginData);
    }
  });
}


/**
 * 生命周期加载方法
 * @param
 * @return
 * @author     :loulan
 * */
onMounted(() => {
  getCaptcha();
})
</script>

<style scoped>

</style>
