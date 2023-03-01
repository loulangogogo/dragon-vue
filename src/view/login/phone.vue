<template>
  <phone-verify v-model:account="loginData.account"
                v-model:verify-code="loginData.password"
                ref="phoneVerifyRef"
                :type="PhoneMessageTypeEnum.LOGIN"/>
  <div align="center" style="margin-top: 35px">
    <a-button type="primary" @click="submit" size="large" style="width: 150px" :loading="loginButtonLoading">登录</a-button>
  </div>
</template>

<script lang="ts" setup>

import {reactive, ref} from "vue";
import {GrantTypeEnum, PhoneMessageTypeEnum} from "../../common/domain/enums";
import PhoneVerify from "../../common/components/phone-verify.vue";

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

const phoneVerifyRef = ref();

// 登录需要的信息
const loginData = reactive({
  account: undefined,
  password: "",
  grant_type: GrantTypeEnum.PHONE,
});

/**
 * 点击登录提交数据
 * @param
 * @return
 * @author     :loulan
 * */
const submit = () => {
  phoneVerifyRef.value.validate((verify:boolean) => {
    if (verify) {
      emits('loginSubmit', loginData);
    }
  });
}
</script>

<style scoped lang="less">
//手机号输入框使用的是数字框，所以要去掉后面的上下按钮
.phoneInputNumber{
  :deep .arco-input-suffix{
    display: none;
  }
}

// 获取验证码按钮的样式
.verifyCodeStyle{
  cursor: pointer;
}
.verifyCodeStyle:hover {
  color: blue;
}
</style>
