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
    <phone-verify v-model:account="formData.phone"
                  v-model:verify-code="formData.verifyCode"
                  :is-visible-account="!isBinding"
                  ref="phoneVerifyRef"
                  :type="PhoneMessageTypeEnum.BINGDING_USER"/>
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
import {PhoneMessageTypeEnum} from "../../../../common/domain/enums";
import {currentUserBindingPhone, currentUserUnbindingPhone} from "../../../../common/api/system/user";
import {DragonNotice} from "../../../../common/domain/component";
import PhoneVerify from "../../../../common/components/phone-verify.vue";

// 绑定修改数据之后需要重新获取当前用户信息，修改存在store中的当前用户信息
const emits = defineEmits(["reset-user-info"]);
// 用户信息
const {userInfo} = defineProps<{
  userInfo: UserInfo
}>();

// 是否已经绑定
const isBinding = computed(() => coreTool.isNotEmpty(userInfo.phone));

// 弹框确定按钮
const submitLoading = ref(false);

// 弹框显示
const modalVisible = ref(false);
const phoneVerifyRef:any = ref(null);

// 绑定需要的数据
const formData = reactive({
  phone: undefined,
  verifyCode: undefined,
});

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
 * 点击提交按钮
 * @param
 * @return
 * @author     :loulan
 * */
const submit = ()=>{
  phoneVerifyRef.value.validate((verify:boolean) => {
    if (verify) {
      submitLoading.value = true;
      if (isBinding.value) {
        currentUserUnbindingPhone(formData).then((res:ResponseResult)=>{
          if (res.status === ResponseStatusEnum.OK) {
            modalVisible.value = false;
            phoneVerifyRef.value.clearCountDown();
            emits("reset-user-info");
            DragonNotice.success("手机解绑成功");
          }
          submitLoading.value = false;
        })
      } else {
        currentUserBindingPhone(formData).then((res:ResponseResult)=>{
          if (res.status === ResponseStatusEnum.OK) {
            modalVisible.value = false;
            phoneVerifyRef.value.clearCountDown();
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
