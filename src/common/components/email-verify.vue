<template>
  <a-form :model="formData" :rules="formRules" ref="emailFormRef" size="large">
    <a-form-item field="account" label="邮箱">
      <a-input :value="account" @input="(val)=>$emit('update:account',val)" placeholder="请输入你的邮箱……"  allow-clear/>
    </a-form-item>
    <a-form-item field="verifyCode" label="验证码">
      <a-input :value="verifyCode" @input="(val)=>$emit('update:verifyCode',val)" placeholder="请输入你的验证码……"  allow-clear>
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
// 获取验证码的时候需要进行倒计时，这个是倒计时的开关
import {reactive, ref} from "vue";
import {GrantTypeEnum} from "../domain/enums";
import {FieldRule} from "@arco-design/web-vue";

defineProps({
  // 账号
  account: {
    type: String,
    required: false,
    default: undefined
  },
  // 验证码
  verifyCode: {
    type: String,
    required: false,
    default: undefined
  },
  // 消息类型，登陆，注册，绑定，解绑
  type:{
    type: Number,
    required: true,
    default: undefined
  }
})

// 指向表单的ref
const emailFormRef = ref();

// 发送验证码是否进行倒计时
const isStartCountdown = ref(false);

// 表单数据
const formData = reactive({
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
 * 发送验证码
 * @param
 * @return
 * @author     :loulan
 * */
const sendVerifyCode = ()=> {

}
</script>

<style scoped>

/*发送验证码按钮样式*/
.verifyCodeStyle{
  cursor: pointer;
}
.verifyCodeStyle:hover {
  color: blue;
}

</style>
