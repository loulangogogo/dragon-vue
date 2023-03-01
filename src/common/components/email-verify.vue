<template>
  <a-form :model="{account:props.account,verifyCode:props.verifyCode}" :rules="formRules" ref="formRef" size="large">
    <a-form-item field="account" label="邮箱" v-if="props.isVisibleAccount">
      <a-input :model-value="props.account"
               @clear="()=>$emit('update:account',undefined)"
               @input="(val)=>$emit('update:account',val)"
               placeholder="请输入你的邮箱……" allow-clear/>
    </a-form-item>
    <a-form-item field="verifyCode" label="验证码" v-if="props.isVisibleVerifyCode">
      <a-input :model-value="props.verifyCode"
               @clear="()=>$emit('update:verifyCode',undefined)"
               @input="(val)=>$emit('update:verifyCode',val)"
               placeholder="请输入你的邮箱验证码……" allow-clear>
        <template #suffix>
          <a-countdown v-if="isStartCountdown"
                       :value="Date.now() + 90*1000"
                       :now="Date.now()" format="ss"
                       @finish="()=>isStartCountdown=false"
                       :value-style="{fontSize: '14px'}"/>
          <span v-else class="verifyCodeStyle" @click="sendVerifyCode">获取验证码</span>
        </template>
      </a-input>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {EmailMessageTypeEnum} from "../domain/enums";
import {FieldRule, ValidatedError} from "@arco-design/web-vue";
import {core as coreTool} from "owner-tool-js";
import {ResponseResult, ResponseStatusEnum} from "../domain/response";
import {sendEmailCurrentUserVerifyCode, sendEmailLoginVerifyCode, sendEmailVerifyCode} from "../api/email";
import {DragonNotice} from "../domain/component";

const props = withDefaults(defineProps<{
  // 账号
  account?: string;
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
    type: "email",
    required: true,
    message: "邮箱不正确"
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
      if (EmailMessageTypeEnum.LOGIN === props.type) {
        // 发送登陆验证码
        res = await sendEmailLoginVerifyCode(props.account);
      } else if (EmailMessageTypeEnum.BINGDING_USER === props.type) {
        // 发送用户绑定和解绑验证码
        res = props.isVisibleAccount?await sendEmailVerifyCode(props.account, props.type):await sendEmailCurrentUserVerifyCode(props.type);
      } else if (EmailMessageTypeEnum.VALIFY_CODE === props.type) {
        // 单纯的发送验证码
        res = await sendEmailVerifyCode(props.account, props.type);
      } else if (EmailMessageTypeEnum.FIX_PASSWORD === props.type) {
        // 单纯的发送验证码
        res = await sendEmailCurrentUserVerifyCode(props.type);
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

<style scoped>

/*发送验证码按钮样式*/
.verifyCodeStyle {
  cursor: pointer;
}

.verifyCodeStyle:hover {
  color: blue;
}

</style>
