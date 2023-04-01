<template>
<a-modal v-model:visible="modalVisible"
            title="建议反馈"
            title-align="start"
            width="550px"
            :mask-closable="false"
            :closable="false"
            layout="horizontal"
            :auto-label-width="true"
            @close="close">
        <div>
            <phone-verify v-if="UnregisterTypeEnum.PHONE===formData.type" ref="phoneVerifyRef" :is-visible-account="false" v-model:verify-code="formData.verifyCode" :type="PhoneMessageTypeEnum.UN_REGISTER"></phone-verify>
            <email-verify v-if="UnregisterTypeEnum.EMAIL===formData.type" ref="emailVerifyRef" :is-visible-account="false" v-model:verify-code="formData.verifyCode" :type="EmailMessageTypeEnum.UN_REGISTER"></email-verify>
        </div>

        <template #title>
            <a-row style="width: 100%">
                <a-col :span="12">
                <span>注销账号</span>
                </a-col>
                <a-col :span="12" align="right">
                <a-space class="passwordTypeSpace">
                    <icon-phone :stroke-width="6"
                                class="passwordTypeIcon"
                                :style="{color:UnregisterTypeEnum.PHONE===formData.type?'green':''}"
                                @click="formData.type=UnregisterTypeEnum.PHONE"/>
                </a-space>
                <a-space class="passwordTypeSpace">
                    <icon-email :stroke-width="6"
                                class="passwordTypeIcon"
                                :style="{color:UnregisterTypeEnum.EMAIL===formData.type?'green ':''}"
                                @click="formData.type=UnregisterTypeEnum.EMAIL"/>
                </a-space>
                </a-col>
            </a-row>
        </template>
        <template #footer>
        <a-button type="outline" @click="modalVisible=false">取消</a-button>
        <a-button type="primary" @click="submit" :loading="submitLoading">确定</a-button>
        </template>  
    </a-modal>
</template>

<script setup lang="ts">
import EmailVerify from "../../../common/components/email-verify.vue";
import PhoneVerify from "../../../common/components/phone-verify.vue";
import {ref,reactive} from 'vue';
import { ResponseResult, ResponseStatusEnum } from '../../../common/domain/response';
import { DragonNotice } from '../../../common/domain/component';
import {EmailMessageTypeEnum, PhoneMessageTypeEnum} from "../../../common/domain/enums";
import { unregisterCurrentUser } from "../../../common/api/frame";

// 修改密码成功要退出登陆
const emits = defineEmits(["logout"]);

const modalVisible = ref(false);
const submitLoading = ref(false);
const phoneVerifyRef = ref();
const emailVerifyRef = ref();

// 注销账号类型的枚举值
enum UnregisterTypeEnum {
    PHONE = 20,
    EMAIL = 30,
}

const formData = reactive<{
    type : number
    verifyCode : string
}>({
    // 注销账号的类型，是通过手机还是邮件
    type: UnregisterTypeEnum.PHONE,
    // 验证码
    verifyCode: ''
})

/**
 * 点击确定提交按钮
 * @param
 * @return
 * @author     :loulan
 * */
const submit = ()=>{
    if (UnregisterTypeEnum.EMAIL === formData.type) {
        emailVerifyRef.value.validate(async (verify : boolean) => {
            if (verify) {
                const res : ResponseResult = await unregisterCurrentUser(formData);
                if (res.status === ResponseStatusEnum.OK) {
                    emailVerifyRef.value.clearCountDown();
                    DragonNotice.success("注销成功。");
                    modalVisible.value = false;
                    emits("logout");
                }
            }
        })
    } else if (UnregisterTypeEnum.PHONE === formData.type) {
        phoneVerifyRef.value.validate(async (verify : boolean) => {
            if (verify) {
                const res : ResponseResult = await unregisterCurrentUser(formData);
                if (res.status === ResponseStatusEnum.OK) {
                    phoneVerifyRef.value.clearCountDown();
                    DragonNotice.success("注销成功。");
                    modalVisible.value = false;
                    emits("logout");
                }
            }
        });
    } else {
        DragonNotice.error("注销账号发生错误。");
    }
}


/**
 * 关闭弹框触发的事件
 * @param
 * @return
 * @author     :loulan
 * */
 const close = ()=>{
    formData.type = UnregisterTypeEnum.PHONE;
	formData.verifyCode = "";
    submitLoading.value = false;
}

defineExpose({
    /**
     * 打开弹框
     * @param
     * @return
     * @author     :loulan
     * */
    open: ()=>{
        formData.type = UnregisterTypeEnum.PHONE;
	    formData.verifyCode = "";
        submitLoading.value = false;
        modalVisible.value = true;
    }
});

</script>

<style lang="scss" scoped>

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