<template>
  <a-card hoverable class="card">
    <template #extra>
      <a-button type="outline" @click="dealEmail">解绑邮箱</a-button>
    </template>
    <icon-email style="width: 50%;height: 50%;max-width: 150px;min-width: 50px;position: relative;top: 30px"/>
  </a-card>

  <!--绑定和解绑手机-->
  <a-modal v-model:visible="modalVisible"
           title="绑定邮箱"
           title-align="start"
           width="550px"
           :mask-closable="false"
           layout="horizontal"
           :auto-label-width="true"
           @close="close">
    <a-form :model="formData" :rules="formRules" ref="accountFormRef" size="large">
      <a-form-item field="account" label="邮箱">
        <a-input v-model="formData.email" placeholder="请输入你的邮箱……"  allow-clear/>
      </a-form-item>
      <a-form-item field="password" label="验证码">
        <a-input v-model="formData.verifyCode" placeholder="请输入你的验证码……"  allow-clear/>
        <a-button type="primary" status="success" @click="sendMessageCaptcha">
          邮箱验证码
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">

import {reactive, ref} from "vue";
import {FieldRule, Message, ValidatedError} from "@arco-design/web-vue";
import * as $L from "owner-tool-js";

// 弹框显示
const modalVisible = ref(false);
const accountFormRef:any = ref(null);

// 绑定需要的数据
const formData = reactive({
  email: undefined,
  verifyCode: undefined,
});

// 表单校验规则
const formRules:Record<string, FieldRule | FieldRule[]> = {
  email:{
    type: "string",
    minLength: 11,
    maxLength: 11,

    message: "手机号码不正确"
  },
  verifyCode:{
    type: "string",
    required: true,
    message:"验证码不能为空"
  }
}


/**
 * 点击绑定和解绑邮箱的按钮
 * @param
 * @return
 * @author     :loulan
 * */
const dealEmail = ()=> {
  modalVisible.value = true;
}

/**
 * 发送邮箱验证码
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
 * 关闭模态框事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = ()=> {

}
</script>

<style scoped>
/*卡片样式*/
.card {
  height: 100%;
  overflow: hidden;
  text-align: center;
}
</style>
