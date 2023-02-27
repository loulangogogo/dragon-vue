<template>
  <a-card hoverable class="card">
    <template #extra>
      <a-button type="outline" @click="dealEmail">{{isBinding?'解绑':'绑定'}}邮箱</a-button>
    </template>
    <icon-email :style="{color: isBinding?'blue':''}"
                style="width: 50%;height: 50%;max-width: 150px;min-width: 50px;position: relative;top: 30px"/>
  </a-card>

  <!--绑定和解绑手机-->
  <a-modal v-model:visible="modalVisible"
           :title="(isBinding?'解绑':'绑定')+'邮箱'"
           title-align="start"
           width="550px"
           :mask-closable="false"
           layout="horizontal"
           :auto-label-width="true"
           @close="close">
    <a-form :model="formData" :rules="formRules" ref="accountFormRef" size="large">
      <a-form-item v-if="!isBinding"  field="email" label="邮箱">
        <a-input v-model="formData.email" placeholder="请输入你的邮箱……"  allow-clear/>
      </a-form-item>
      <a-form-item field="verifyCode" label="验证码">
        <a-input v-model="formData.verifyCode" placeholder="请输入你的验证码……"  allow-clear>
          <template #suffix>
            <a-countdown v-if="isStartCountdown"
                         :value="Date.now() + 90*1000"
                         :now="Date.now()"
                         format="ss"
                         @finish="()=>isStartCountdown=false"
                         :value-style="{fontSize: '14px'}"/>
            <span v-else class="verifyCodeStyle" @click="sendMessageCaptcha">获取验证码</span>
          </template>
        </a-input>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="outline" @click="modalVisible=false">取消</a-button>
      <a-button type="primary" @click="submit" :loading="submitLoading">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">

import {reactive, ref,computed} from "vue";
import {FieldRule, Message, ValidatedError} from "@arco-design/web-vue";
import * as $L from "owner-tool-js";
import {UserInfo} from "../../../../common/domain/common";
import {core as coreTool} from "owner-tool-js";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {sendEmailCurrentUserUnbindingVerifyCode,sendEmailVerifyCode} from "../../../../common/api/email";
import {EmailMessageTypeEnum} from "../../../../common/domain/enums";
import {currentUserBindingEmail, currentUserUnbindingEmail} from "../../../../common/api/system/user";
import {DragonNotice} from "../../../../common/domain/component";

// 绑定修改数据之后需要重新获取当前用户信息，修改存在store中的当前用户信息
const emits = defineEmits(["reset-user-info"]);
// 用户信息
const {userInfo} = defineProps<{
  userInfo: UserInfo
}>();

// 是否已经绑定
const isBinding = computed(() => coreTool.isNotEmpty(userInfo.email));

// 提交绑定和解绑时候的确定按钮是否处于加载状态
const submitLoading = ref(false);

// 获取验证码的时候需要进行倒计时，这个是倒计时的开关
const isStartCountdown = ref(false);

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
    type: "email",
    required: true,
    message: "邮箱不正确"
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
  accountFormRef.value.validateField("email",async (errors: undefined | Record<string, ValidatedError>) => {
    // 当errors为undefined的时候表示校验成功没有错误
    if ($L.core.isUndefined(errors)) {
      isStartCountdown.value = true;
      const res:ResponseResult = await (isBinding.value?sendEmailCurrentUserUnbindingVerifyCode():sendEmailVerifyCode(formData.email,EmailMessageTypeEnum.BINGDING_USER));
      if (res.status === ResponseStatusEnum.OK) {
        // 暂时不进行任何操作
      } else {
        isStartCountdown.value = false;
      }
    }
  });
}

/**
 * 点击确定提交按钮
 * @param
 * @return
 * @author     :loulan
 * */
const submit = ()=>{
  accountFormRef.value.validate((errors: undefined | Record<string, ValidatedError>) => {
    // 当errors为undefined的时候表示校验成功没有错误
    if ($L.core.isUndefined(errors)) {
      submitLoading.value = true;
      if (isBinding.value) {
        currentUserUnbindingEmail(formData).then((res:ResponseResult)=>{
          if (res.status === ResponseStatusEnum.OK) {
            modalVisible.value = false;
            isStartCountdown.value = false;
            emits("reset-user-info");
            DragonNotice.success("邮箱解绑成功");
          }
          submitLoading.value = false;
        })
      } else {
        currentUserBindingEmail(formData).then((res:ResponseResult)=>{
          if (res.status === ResponseStatusEnum.OK) {
            modalVisible.value = false;
            isStartCountdown.value = false;
            emits("reset-user-info");
            DragonNotice.success("邮箱绑定成功");
          }
          submitLoading.value = false;
        })
      }
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
  formData.email = undefined;
  formData.verifyCode = undefined;
}
</script>

<style scoped>
/*卡片样式*/
.card {
  height: 100%;
  overflow: hidden;
  text-align: center;
}

.verifyCodeStyle{
  cursor: pointer;
}
.verifyCodeStyle:hover {
  color: blue;
}
</style>
