<template>
  <a-form :model="loginData" :rules="formRules" ref="accountFormRef" size="large">
    <a-form-item field="account" label="用户名">
      <a-input v-model="loginData.account" @keyup.enter="submit" placeholder="用户名/手机/邮箱" allow-clear/>
    </a-form-item>
    <a-form-item field="password" label="密码">
      <a-input-password v-model="loginData.password" @keyup.enter="submit" placeholder="请输入密码……" allow-clear autocomplete/>
    </a-form-item>
    <a-form-item field="captchaCode" label="验证码">
      <a-input v-model="loginData.captchaCode" @keyup.enter="submit" placeholder="验证码……" allow-clear/>
      <a-image :src="loginData.captchaUrl" height="34" width="100px" :preview="false" @click="getCaptcha"></a-image>
    </a-form-item>
  </a-form>
  <div align="center" style="margin-top: 35px">
    <a-button type="primary" @click="submit" size="large" style="width: 150px" :loading="loginButtonLoading">登录</a-button>
  </div>
</template>

<script lang="ts" setup>

import {onMounted, reactive, ref} from "vue";
import {FieldRule, ValidatedError} from "@arco-design/web-vue";
import {core as coreTool} from 'owner-tool-js';
import {generatePicCaptcha} from "../../common/api/common";
import {ResponseResult, ResponseStatusEnum} from "../../common/domain/response";
import {GrantTypeEnum} from "../../common/domain/enums";


// 事件对象
const emits = defineEmits(['loginSubmit']);

// 表单ref
const accountFormRef: any = ref(null);

// 登录需要的信息
const loginData = reactive({
  account: "",
  password: "",
  grant_type: GrantTypeEnum.PASSWORD,
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
  captchaCode: {
    type: "string",
    required: true,
    message: "验证码不能为空"
  }
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
    if (coreTool.isUndefined(errors)) {
      emits('loginSubmit', loginData);
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


defineProps({
  // 登录按钮的加载状态
  loginButtonLoading:{
    type: Boolean,
    required: false,
    default: false
  }
})

defineExpose({
  /**
   * 登录错误要执行的操作
   * @param
   * @return
   * @author     :loulan
   * */
  loginError: (res:ResponseResult)=>{
    getCaptcha();
  }
})
</script>

<style scoped>

</style>
