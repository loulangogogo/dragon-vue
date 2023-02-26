<template>
  <a-form :model="loginData" :rules="formRules" ref="accountFormRef" size="large">
    <a-form-item field="account" label="手机号">
      <a-input-number v-model="loginData.account" placeholder="请输入你的手机号……" class="phoneInputNumber">
        <template #prepend>
          +86
        </template>
      </a-input-number>
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
    <a-button type="primary" @click="submit" size="large" style="width: 150px">登录</a-button>
  </div>
</template>

<script lang="ts" setup>

import {reactive, ref} from "vue";
import {FieldRule, Message, ValidatedError} from "@arco-design/web-vue";
import * as $L from 'owner-tool-js';
import {GrantTypeEnum} from "../../common/domain/enums";
import {ResponseResult, ResponseStatusEnum} from "../../common/domain/response";
import {sendPhoneLoginVerifyCode} from "../../common/api/login";

// 事件对象
const emits = defineEmits(['loginSubmit']);

const accountFormRef:any = ref(null);

// 获取验证码的时候需要进行倒计时，这个是倒计时的开关
const isStartCountdown = ref(false);

// 登录需要的信息
const loginData = reactive({
  account: undefined,
  password: "",
  grant_type: GrantTypeEnum.PHONE,
});

// 表单校验规则
const formRules:Record<string, FieldRule | FieldRule[]> = {
  account:{
    type: "number",
    minLength: 11,
    maxLength: 11,
    required: true,
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
  accountFormRef.value.validateField("account",async (errors: undefined | Record<string, ValidatedError>) => {
    // 当errors为undefined的时候表示校验成功没有错误
    if ($L.core.isUndefined(errors)) {
      isStartCountdown.value = true;
      const res:ResponseResult = await sendPhoneLoginVerifyCode(loginData.account);
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
