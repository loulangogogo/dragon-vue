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
           :title="'扫码绑'+(isBinding?'解绑':'绑定')+'手机'"
           title-align="start"
           width="550px"
           :mask-closable="false"
           layout="horizontal"
           :auto-label-width="true"
           @close="close">
    <div align="center" style="position: static">
      <a-form :model="formData" :rules="formRules" ref="accountFormRef" size="large">
        <a-form-item field="account" label="手机号">
          <a-input-number v-model="formData.phone" placeholder="请输入你的手机号……" >
            <template #prepend>
              +86
            </template>
          </a-input-number>
        </a-form-item>
        <a-form-item field="password" label="验证码">
          <a-input v-model="formData.verifyCode" placeholder="请输入你的验证码……"  allow-clear/>
          <a-button type="primary" status="success" @click="sendMessageCaptcha">
            短信验证码
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {FieldRule, Message, ValidatedError} from "@arco-design/web-vue";
import * as $L from "owner-tool-js";
import {UserInfo} from "../../../../common/domain/common";
import {computed} from "_vue@3.2.44@vue";
import {core as coreTool} from "_owner-tool-js@2.0.6@owner-tool-js";

// 绑定修改数据之后需要重新获取当前用户信息，修改存在store中的当前用户信息
const emits = defineEmits(["reset-user-info"]);
// 用户信息
const {userInfo} = defineProps<{
  userInfo: UserInfo
}>();

// 是否已经绑定
const isBinding = computed(() => coreTool.isNotEmpty(userInfo.openid));

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
  accountFormRef.value.validateField("account",(errors: undefined | Record<string, ValidatedError>) => {
    // 当errors为undefined的时候表示校验成功没有错误
    if ($L.core.isUndefined(errors)) {
      Message.error("当前功能正在开发中。");
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

<style scoped>
/*卡片样式*/
.card {
  height: 100%;
  overflow: hidden;
  text-align: center;
}
</style>
