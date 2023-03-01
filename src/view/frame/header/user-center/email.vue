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
    <email-verify v-model:account="formData.email"
                  v-model:verify-code="formData.verifyCode"
                  :is-visible-account="!isBinding"
                  ref="emailVerifyRef"
                  :type="EmailMessageTypeEnum.BINGDING_USER"/>
    <template #footer>
      <a-button type="outline" @click="modalVisible=false">取消</a-button>
      <a-button type="primary" @click="submit" :loading="submitLoading">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">

import {computed, reactive, ref} from "vue";
import {core as coreTool} from "owner-tool-js";
import {UserInfo} from "../../../../common/domain/common";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {EmailMessageTypeEnum} from "../../../../common/domain/enums";
import {currentUserBindingEmail, currentUserUnbindingEmail} from "../../../../common/api/system/user";
import {DragonNotice} from "../../../../common/domain/component";
import EmailVerify from "../../../../common/components/email-verify.vue";

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

// 弹框显示
const modalVisible = ref(false);

const emailVerifyRef:any = ref(null);

// 绑定需要的数据
const formData = reactive({
  email: undefined,
  verifyCode: undefined,
});

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
 * 点击确定提交按钮
 * @param
 * @return
 * @author     :loulan
 * */
const submit = ()=>{
  emailVerifyRef.value.validate((verify:boolean) => {
    if (verify) {
      submitLoading.value = true;
      if (isBinding.value) {
        currentUserUnbindingEmail(formData).then((res:ResponseResult)=>{
          if (res.status === ResponseStatusEnum.OK) {
            modalVisible.value = false;
            emailVerifyRef.value.clearCountDown();
            emits("reset-user-info");
            DragonNotice.success("邮箱解绑成功");
          }
          submitLoading.value = false;
        })
      } else {
        currentUserBindingEmail(formData).then((res:ResponseResult)=>{
          if (res.status === ResponseStatusEnum.OK) {
            modalVisible.value = false;
            emailVerifyRef.value.clearCountDown();
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
