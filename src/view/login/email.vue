<template>
  <email-verify v-model:account="loginData.account"
                v-model:verify-code="loginData.password"
                ref="emailVerifyRef"
                :type="EmailMessageTypeEnum.LOGIN"/>
  <div align="center" style="margin-top: 35px">
    <a-button type="primary" @click="submit" size="large" style="width: 150px" :loading="loginButtonLoading">登录</a-button>
  </div>
</template>

<script lang="ts" setup>

import {reactive, ref} from "vue";
import {EmailMessageTypeEnum, GrantTypeEnum} from "../../common/domain/enums";
import EmailVerify from "../../common/components/email-verify.vue";

defineProps({
  // 登录按钮的加载状态
  loginButtonLoading:{
    type: Boolean,
    required: false,
    default: false
  }
})

// 邮件验证的ref
const emailVerifyRef = ref();

// 事件对象
const emits = defineEmits(['loginSubmit']);


// 登录需要的信息
const loginData = reactive({
  account: "",
  password: "",
  grant_type: GrantTypeEnum.EMAIL,
});


/**
 * 点击登录提交数据
 * @param
 * @return
 * @author     :loulan
 * */
const submit = () => {
  emailVerifyRef.value.validate((verify:boolean) => {
    if (verify) {
      emits('loginSubmit', loginData);
    }
  });
}
</script>

<style scoped>

</style>
