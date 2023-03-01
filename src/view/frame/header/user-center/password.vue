<template>
  <a-card hoverable class="card">
    <template #extra>
      <a-button type="outline" @click="dealPassword">修改密码</a-button>
    </template>
    <icon-eye-invisible style="color:blue;width: 50%;height: 50%;max-width: 150px;min-width: 50px;position: relative;top: 30px"/>
  </a-card>

  <!--绑定和解绑手机-->
  <a-modal v-model:visible="modalVisible"
           title="修改密码"
           title-align="start"
           width="550px"
           :mask-closable="false"
           :closable="false"
           layout="horizontal"
           :auto-label-width="true"
           @close="close">
    <div>
      <phone-verify v-if="FixPasswordType.PHONE===formData.type" ref="phoneVerifyRef" :is-visible-account="false" v-model:verify-code="formData.verifyCode" :type="PhoneMessageTypeEnum.FIX_PASSWORD"></phone-verify>
      <email-verify v-if="FixPasswordType.EMAIL===formData.type" ref="emailVerifyRef" :is-visible-account="false" v-model:verify-code="formData.verifyCode" :type="EmailMessageTypeEnum.FIX_PASSWORD"></email-verify>

      <a-form :model="formData" :rules="formRules" ref="passwordFormRef" size="large">
        <a-form-item v-if="FixPasswordType.PASSWORD===formData.type" field="oldPassword" label="旧密码">
          <a-input v-model="formData.oldPassword" placeholder="请输入旧密码……" allow-clear/>
        </a-form-item>
        <a-form-item field="newPassword" label="新密码">
          <a-input-password v-model="formData.newPassword" placeholder="请输入新密码……" allow-clear/>
        </a-form-item>
      </a-form>
    </div>
    <template #footer>
      <a-button type="outline" @click="modalVisible=false">取消</a-button>
      <a-button type="primary" @click="submit" :loading="submitLoading">确定</a-button>
    </template>
    <template #title>
      <a-row style="width: 100%">
        <a-col :span="12">
          <span>修改密码</span>
        </a-col>
        <a-col :span="12" align="right">
          <a-space class="passwordTypeSpace">
            <icon-tool :stroke-width="6"
                       class="passwordTypeIcon"
                       :style="{color:FixPasswordType.PASSWORD===formData.type?'green':''}"
                       @click="formData.type=FixPasswordType.PASSWORD"/>
          </a-space>
          <a-space class="passwordTypeSpace">
            <icon-phone :stroke-width="6"
                        class="passwordTypeIcon"
                        :style="{color:FixPasswordType.PHONE===formData.type?'green':''}"
                        @click="formData.type=FixPasswordType.PHONE"/>
          </a-space>
          <a-space class="passwordTypeSpace">
            <icon-email :stroke-width="6"
                        class="passwordTypeIcon"
                        :style="{color:FixPasswordType.EMAIL===formData.type?'green ':''}"
                        @click="formData.type=FixPasswordType.EMAIL"/>
          </a-space>
        </a-col>
      </a-row>
    </template>
  </a-modal>
</template>

<script setup lang="ts">

import {UserInfo} from "../../../../common/domain/common";
import {reactive, ref} from "vue";
import {FieldRule,ValidatedError} from "@arco-design/web-vue";
import EmailVerify from "../../../../common/components/email-verify.vue";
import PhoneVerify from "../../../../common/components/phone-verify.vue";
import {EmailMessageTypeEnum, PhoneMessageTypeEnum} from "../../../../common/domain/enums";
import {core as coreTool} from "owner-tool-js";
import {DragonNotice} from "../../../../common/domain/component";
import {fixCurrentuserPassword} from "../../../../common/api/system/user";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";

// 绑定修改数据之后需要重新获取当前用户信息，修改存在store中的当前用户信息
const emits = defineEmits(["reset-user-info"]);
// 用户信息
const {userInfo} = defineProps<{
  userInfo: UserInfo
}>();

// 弹框显示变量
const modalVisible = ref(false);

const phoneVerifyRef = ref();
const emailVerifyRef = ref();
const passwordFormRef = ref();

// 确定提交按钮的加载状态
const submitLoading = ref(false);

// 修改密码类型的美居之
enum FixPasswordType {
  PASSWORD = 10,
  PHONE = 20,
  EMAIL = 30,
}

// 修改数据
const formData = reactive<{
  oldPassword: string
  newPassword: string
  type: number
  verifyCode: string
}>({
  // 旧密码
  oldPassword: '',
  // 新密码
  newPassword: '',
  // 修改密码的类型
  type: FixPasswordType.PASSWORD,
  // 验证码
  verifyCode: ''
})

// 表单校验规则
const formRules: Record<string, FieldRule | FieldRule[]> = {
  oldPassword: {
    type: "string",
    required: true,
    message: "旧密码不能为空"
  },
  newPassword: {
    type: "string",
    required: true,
    message: "新密码不能为空"
  }
}

/**
 * 点击修改密码的按钮
 * @param
 * @return
 * @author     :loulan
 * */
const dealPassword = ()=>{
  modalVisible.value = true;
}

/**
 * 修改密码
 * @param
 * @return
 * @author     :loulan
 * */
const submitFixPassword = async ()=>{
  submitLoading.value = true;
  const res: ResponseResult = await fixCurrentuserPassword(formData);
  if (res.status === ResponseStatusEnum.OK) {
    modalVisible.value = false;
    submitLoading.value = false;
    DragonNotice.success("密码修改成功");
  } else {
    submitLoading.value = false;
  }
}

/**
 * 点击确定提交按钮
 * @param
 * @return
 * @author     :loulan
 * */
const submit = ()=>{
  if (FixPasswordType.PASSWORD === formData.type) {
    passwordFormRef.value.validate((errors: undefined | Record<string, ValidatedError>) => {
      // 当errors为undefined的时候表示校验成功没有错误
      if (coreTool.isUndefined(errors)) {
        submitFixPassword();
      }
    });
  }else if (FixPasswordType.EMAIL === formData.type) {
    emailVerifyRef.value.validate((verify:boolean)=>{
      if (verify) {
        passwordFormRef.value.validate((errors: undefined | Record<string, ValidatedError>) => {
          // 当errors为undefined的时候表示校验成功没有错误
          if (coreTool.isUndefined(errors)) {
            submitFixPassword();
            emailVerifyRef.value.clearCountDown();
          }
        });
      }
    })
  }else if (FixPasswordType.PHONE === formData.type) {
    phoneVerifyRef.value.validate((verify: boolean) => {
      if (verify) {
        passwordFormRef.value.validate((errors: undefined | Record<string, ValidatedError>) => {
          // 当errors为undefined的时候表示校验成功没有错误
          if (coreTool.isUndefined(errors)) {
            submitFixPassword();
            phoneVerifyRef.value.clearCountDown();
          }
        });
      }
    });
  } else {
    DragonNotice.error("修改密码类型错误。");
  }
}

/**
 * 模态框关闭的时候触发的事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = ()=>{
  formData.type = FixPasswordType.PASSWORD;
  formData.verifyCode = '';
  formData.newPassword = '';
  formData.oldPassword = '';
  submitLoading.value = false;
}

</script>

<style scoped>
/*卡片样式*/
.card {
  height: 100%;
  overflow: hidden;
  text-align: center;
}

/*修改密码的空间样式*/
.passwordTypeSpace{
  margin-right: 10px;
}
/*修改密码图标样式*/
.passwordTypeIcon{
  font-weight: bolder;
  cursor: pointer;
  font-size: 20px;
}
</style>
