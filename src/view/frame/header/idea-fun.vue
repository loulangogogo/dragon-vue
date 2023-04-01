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
        <a-form :model="formData" :rules="formRules" ref="formRef" size="large">
            <a-form-item field="optType" label="反馈类型">
                <a-radio-group v-model="formData.optType">
                    <a-radio :value="IdeaOptTypeEnum.IDEA_FUNCTION">功能建议</a-radio>
                    <a-radio :value="IdeaOptTypeEnum.IDEA_QUESTION">问题反馈</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item field="content" label="内容">
                <a-textarea v-model="formData.content" placeholder="请输入内容"
                    :auto-size="{
                        minRows:3,
                        maxRows:6
                    }"
                    show-word-limit :max-length="100" allow-clear/>
            </a-form-item>
            <a-form-item field="nt" label="联系方式">
                <a-input v-model="formData.nt" placeholder="请输入您的联系方式……" :max-length="32" allow-clear/>
            </a-form-item>
        </a-form>  
        <template #footer>
        <a-button type="outline" @click="modalVisible=false">取消</a-button>
        <a-button type="primary" @click="submit" :loading="submitLoading">确定</a-button>
        </template>  
    </a-modal>
</template>

<script lang="ts" setup>
import { FieldRule, ValidatedError } from '@arco-design/web-vue';
import { core as coreTool } from 'owner-tool-js';
import {ref,reactive} from 'vue';
import { ResponseResult, ResponseStatusEnum } from '../../../common/domain/response';
import {addFunIdea} from '../../../common/api/log/log';
import { DragonNotice } from '../../../common/domain/component';


const modalVisible = ref(false);
const formRef = ref();
const submitLoading = ref(false);

// 功能建议枚举类型值
enum IdeaOptTypeEnum {
    IDEA_FUNCTION = 30,
    IDEA_QUESTION = 31,
}

// 表单数据
const formData = reactive<{
  optType: number
  content: string
  nt: string
}>({
    optType: IdeaOptTypeEnum.IDEA_FUNCTION,
    content: "",
    nt: ""
})

// 表单校验规则
const formRules: Record<string, FieldRule | FieldRule[]> = {
    optType: {
        type: "string",
        required: true,
        message: "反馈类型不能为空"
    },
    content: {
        type: "string",
        required: true,
        message: "内容不能为空。"
    },
    nt: {
        type: "string",
        required: true,
        message: "联系方式不能为空。"
    }
}

/**
 * 点击确定提交按钮
 * @param
 * @return
 * @author     :loulan
 * */
const submit = ()=>{
    formRef.value.validate(async (errors: undefined | Record<string, ValidatedError>) => {
        // 当errors为undefined的时候表示校验成功没有错误
        if (coreTool.isUndefined(errors)) {
            submitLoading.value = true;
            let res:ResponseResult = await addFunIdea(formData);
            if (res.status === ResponseStatusEnum.OK){
                DragonNotice.success("提交成功。");
                modalVisible.value = false;
            }
            submitLoading.value = false;
        }
    });
}

/**
 * 关闭弹框触发的事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = ()=>{
    formData.content="";
    formData.nt = "";
    formData.optType=IdeaOptTypeEnum.IDEA_FUNCTION;

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
        formData.content="";
        formData.nt = "";
        formData.optType=IdeaOptTypeEnum.IDEA_FUNCTION;
        modalVisible.value = true;
    }
});
</script>

<style lang="scss" scoped>

</style>