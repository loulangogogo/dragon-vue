<template>
  <a-form :model="{account:props.account,verifyCode:props.verifyCode}" :rules="formRules" ref="formRef" size="large">
    <a-form-item field="account" label="手机" v-if="props.isVisibleAccount">
      <a-input-number :model-value="props.account"
                      @clear="()=>$emit('update:account',undefined)"
                      @input="(val)=>$emit('update:account',val)"
                      placeholder="请输入你的手机号码……"
                      allow-clear
                      class="phoneInputNumber">
        <template #prepend>
          +86
        </template>
      </a-input-number>
    </a-form-item>
    <a-form-item field="verifyCode" label="验证码" v-if="props.isVisibleVerifyCode">
      <a-input :model-value="props.verifyCode"
               @clear="()=>$emit('update:verifyCode',undefined)"
               @input="(val)=>$emit('update:verifyCode',val)"
               placeholder="请输入你的短信验证码……" allow-clear>
        <template #suffix>
          <countdown-seconds v-if="isStartCountdown" :seconds="90" :start="isStartCountdown" @finish="()=>isStartCountdown=false"></countdown-seconds>
          <span v-else class="verifyCodeStyle" @click="sendVerifyCode">获取验证码</span>
        </template>
      </a-input>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {PhoneMessageTypeEnum} from "../domain/enums";
import {FieldRule, ValidatedError} from "@arco-design/web-vue";
import {core as coreTool} from "owner-tool-js";
import {ResponseResult, ResponseStatusEnum} from "../domain/response";
import {DragonNotice} from "../domain/component";
import {sendPhoneCurrentUserVerifyCode, sendPhoneLoginVerifyCode, sendPhoneVerifyCode} from "../api/phone";
import CountdownSeconds from "./countdown-seconds.vue";

const props = withDefaults(defineProps<{
  // 账号
  account?: number;
  isVisibleAccount?: boolean;
  // 验证码
  verifyCode?: string;
  isVisibleVerifyCode?: boolean;
  // 消息类型，登陆，注册，绑定，解绑
  type: number;
}>(),{
  account: undefined,
  verifyCode: undefined,
  type: undefined,
  isVisibleAccount: true,
  isVisibleVerifyCode: true
})

// 指向表单的ref
const formRef = ref();

// 发送验证码是否进行倒计时
const isStartCountdown = ref(false);

// 表单校验规则
const formRules: Record<string, FieldRule | FieldRule[]> = {
  account: {
    type: "number",
    minLength: 11,
    maxLength: 11,
    required: true,
    message: "手机号码不正确"
  },
  verifyCode: {
    type: "string",
    required: true,
    message: "验证码不能为空"
  }
}

/**
 * 发送验证码
 * @param
 * @return
 * @author     :loulan
 * */
const sendVerifyCode = () => {
  formRef.value.validateField("account", async (errors: undefined | Record<string, ValidatedError>) => {
    // 当errors为undefined的时候表示校验成功没有错误
    if (coreTool.isUndefined(errors)) {
      isStartCountdown.value = true;
      let res: ResponseResult = {};
      // 根据不同类型，进行验证码的发送
      if (PhoneMessageTypeEnum.LOGIN === props.type) {
        // 发送登陆验证码
        res = await sendPhoneLoginVerifyCode(props.account);
      } else if (PhoneMessageTypeEnum.BINGDING_USER === props.type) {
        // 发送绑定和解绑验证码
        res = props.isVisibleAccount?await sendPhoneVerifyCode(props.account, props.type):await sendPhoneCurrentUserVerifyCode(props.type);
      } else if (PhoneMessageTypeEnum.VALIFY_CODE === props.type) {
        // 单纯发送验证码
        res = await sendPhoneVerifyCode(props.account, props.type);
      }  else if (PhoneMessageTypeEnum.FIX_PASSWORD === props.type) {
        // 发送修改短信验证码
        res = await sendPhoneCurrentUserVerifyCode(props.type);
      } else {
        DragonNotice.error("当前操作错误。");
        return;
      }

      // 判断发送成功与否
      if (res.status === ResponseStatusEnum.OK) {
        // 暂时不进行任何操作
      } else {
        isStartCountdown.value = false;
      }
    }
  })
}

defineExpose({
  /**
   * 校验方法，外部调用，校验成功返回true，校验失败返回false
   * @param
   * @return  异步Promise
   * @author     :loulan
   * */
  validate: (callback: Function) => {
    formRef.value.validate((errors: undefined | Record<string, ValidatedError>) => {
      // 当errors为undefined的时候表示校验成功没有错误
      if (coreTool.isUndefined(errors)) {
        callback(true);
      } else {
        callback(false);
      }
    });
  },

  /**
   * 清除倒计时
   * @param
   * @return
   * @author     :loulan
   * */
  clearCountDown: ()=>{
    isStartCountdown.value = false
  }
})
</script>

<style scoped lang="less">
//手机号输入框使用的是数字框，所以要去掉后面的上下按钮
.phoneInputNumber{
  :deep .arco-input-suffix{
    display: none;
  }
}

/*发送验证码按钮样式*/
.verifyCodeStyle {
  cursor: pointer;
}

.verifyCodeStyle:hover {
  color: blue;
}
</style>
