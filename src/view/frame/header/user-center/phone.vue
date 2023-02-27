<template>
  <a-card hoverable class="card">
    <template #extra>
      <a-button type="outline" @click="dealPhone">{{isBinding?'解绑':'绑定'}}手机</a-button>
    </template>
    <icon-phone :style="{color: isBinding?'blue':''}"
                style="width: 50%;height: 50%;max-width: 150px;min-width: 50px;position: relative;top: 30px"/>
  </a-card>

  <!--绑定和解绑手机-->
  <a-modal v-model:visible="modalVisible"
           :title="(isBinding?'解绑':'绑定')+'手机'"
           title-align="start"
           width="550px"
           :mask-closable="false"
           layout="horizontal"
           :auto-label-width="true"
           @close="close">
    <div align="center" style="position: static">
      <a-form :model="formData" :rules="formRules" ref="accountFormRef" size="large">
        <a-form-item v-if="!isBinding" field="phone" label="手机号">
          <a-input-number v-model="formData.phone" placeholder="请输入你的手机号……" class="phoneInputNumber">
            <template #prepend>
              +86
            </template>
          </a-input-number>
        </a-form-item>
        <a-form-item field="verifyCode" label="验证码">
          <a-input v-model="formData.verifyCode" placeholder="请输入你的验证码……"  allow-clear>
            <template #suffix>
              <a-countdown v-if="isStartCountdown"
                  :value="Date.now() + 10 * 1000"
                  :now="Date.now()"
                  format="ss"
                  @finish="()=>isStartCountdown=false"
                  :value-style="{fontSize: '14px'}"/>
              <span v-else class="verifyCodeStyle" @click="sendMessageCaptcha">获取验证码</span>
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </div>

    <template #footer>
      <a-button type="outline" @click="modalVisible=false">取消</a-button>
      <a-button type="primary" @click="submit" :loading="submitLoading">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {FieldRule, ValidatedError} from "@arco-design/web-vue";
import * as $L from "owner-tool-js";
import {core as coreTool} from "owner-tool-js";
import {UserInfo} from "../../../../common/domain/common";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {PhoneMessageTypeEnum} from "../../../../common/domain/enums";
import {sendPhoneCurrentUserUnbindingVerifyCode, sendPhoneVerifyCode} from "../../../../common/api/phone";
import {currentUserBindingPhone, currentUserUnbindingPhone} from "../../../../common/api/system/user";
import {DragonNotice} from "../../../../common/domain/component";

// 绑定修改数据之后需要重新获取当前用户信息，修改存在store中的当前用户信息
const emits = defineEmits(["reset-user-info"]);
// 用户信息
const {userInfo} = defineProps<{
  userInfo: UserInfo
}>();

// 是否已经绑定
const isBinding = computed(() => coreTool.isNotEmpty(userInfo.phone));

// 获取验证码的时候需要进行倒计时，这个是倒计时的开关
const isStartCountdown = ref(false);

// 弹框确定按钮
const submitLoading = ref(false);

// 弹框显示
const modalVisible = ref(false);
const accountFormRef:any = ref(null);

// 绑定需要的数据
const formData = reactive({
  phone: undefined,
  verifyCode: undefined,
});

// 表单校验规则
const formRules:Record<string, FieldRule | FieldRule[]> = {
  phone:{
    type: "number",
    minLength: 11,
    maxLength: 11,
    required: true,
    message: "手机号码不正确"
  },
  verifyCode:{
    type: "string",
    required: true,
    message:"验证码不能为空"
  }
}

/**
 * 点击绑定和解绑手机按钮
 * @param
 * @return
 * @author     :loulan
 * */
const dealPhone = ()=>{
  modalVisible.value = true;
}

/**
 * 发送短信验证码
 * @param
 * @return
 * @author     :loulan
 * */
const sendMessageCaptcha = ()=> {
  accountFormRef.value.validateField("phone",async (errors: undefined | Record<string, ValidatedError>) => {
    // 当errors为undefined的时候表示校验成功没有错误
    if ($L.core.isUndefined(errors)) {
      isStartCountdown.value = true;
      const res:ResponseResult = await (isBinding.value?sendPhoneCurrentUserUnbindingVerifyCode():sendPhoneVerifyCode(formData.phone,PhoneMessageTypeEnum.BINGDING_USER));
      if (res.status === ResponseStatusEnum.OK) {
        // 暂时不进行任何操作
      } else {
        isStartCountdown.value = false;
      }
    }
  });
}

/**
 * 点击提交按钮
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
        currentUserUnbindingPhone(formData).then((res:ResponseResult)=>{
          if (res.status === ResponseStatusEnum.OK) {
            modalVisible.value = false;
            isStartCountdown.value = false;
            emits("reset-user-info");
            DragonNotice.success("手机解绑成功");
          }
          submitLoading.value = false;
        })
      } else {
        currentUserBindingPhone(formData).then((res:ResponseResult)=>{
          if (res.status === ResponseStatusEnum.OK) {
            modalVisible.value = false;
            isStartCountdown.value = false;
            emits("reset-user-info");
            DragonNotice.success("手机绑定成功");
          }
          submitLoading.value = false;
        })
      }
    }
  });
}

/**
 * 弹框关闭事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = ()=>{

}
</script>

<style scoped lang="less">
/*卡片样式*/
.card {
  height: 100%;
  overflow: hidden;
  text-align: center;
}

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
