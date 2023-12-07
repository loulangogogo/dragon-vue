<template>
  <a-modal v-model:visible="modalVisible"
           :title="isAddEdit===AddEditEnum.ADD?'任务添加':'任务编辑'"
           title-align="start"
           width="550px"
           :mask-closable="false"
           @close="close">
    <a-form ref="formRef" :model="formData" :rules="formRules">
      <a-form-item field="name" label="任务名称">
        <a-input v-model="formData.name" placeholder="请输入任务名称"/>
      </a-form-item>
      <a-form-item field="applicationName" label="应用服务">
        <a-input v-model="formData.applicationName" placeholder="请输入应用名称（serviceId）"/>
      </a-form-item>
      <a-form-item field="cron" label="cron">
        <a-input v-model="formData.cron" placeholder="请输入表达式"/>
      </a-form-item>
      <a-form-item field="mode" label="执行模式">
        <a-select v-model="formData.mode" :scrollbar="false" style="width: 100%"
                  placeholder="请选择错过执行的策略" allow-clear>
          <a-option :value="0">默认</a-option>
          <a-option :value="10">立即触发执行</a-option>
          <a-option :value="20">触发一次执行</a-option>
          <a-option :value="30">不触发立即执行</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="isConcurrent" label="是否并行">
        <a-radio-group v-model="formData.isConcurrent">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item  field="runTime" label="运行时间">
        <a-input-number v-model="formData.runTime" :precision="0" :min="5" :max="1800" placeholder="请输入大概的运行时间"  hide-button>
          <template #append>
            <span>秒</span>
          </template>
        </a-input-number>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="outline" @click="modalVisible=false">取消</a-button>
      <a-button type="primary" @click="submit" :loading="submitLoading">确定</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>

import {core as coreTool, functionTool} from 'owner-tool-js';
import {ref} from "vue";
import {AddEditEnum} from "../../../common/domain/enums";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {DragonNotice} from "../../../common/domain/component";
import {jobSave, jobUpdate} from "../../../common/api/scheduler/schedulerJob";

const emits = defineEmits(["query"]);

// 确定提交按钮的加载状态
const submitLoading = ref(false);

// 当前是添加还是编辑，默认添加
const isAddEdit = ref(AddEditEnum.ADD);

// 表单的ref
const formRef = ref();
// 模态框的显示状态
const modalVisible = ref(false);
// 表单数据
const initFormData = {
  id: undefined,
  name: undefined,
  applicationName: undefined,
  cron: undefined,
  mode: undefined,
  isConcurrent:false,
  runTime: undefined
};
const formData = ref({...initFormData});
const formRules = {
  name: {
    required: true,
    message: "任务名称不能为空"
  },
  cron: {
    required: true,
    message: "cron表达式不能为空"
  },
  mode: {
    required: true,
    message: "执行模式不能为空"
  },
  isConcurrent: {
    required: true,
    message: "是否并行不能为空"
  },
  runTime: {
    required: true,
    message: "运行时间不能为空"
  }
};

/**
 * 点击确定按钮
 * @param
 * @return
 * @author     :loulan
 * */
const submit = () => {
  submitLoading.value = true;
  formRef.value.validate(async (errors: any) => {
    // 如果没有错误进行提交
    if (coreTool.isUndefined(errors)) {
      const res: ResponseResult = (isAddEdit.value == AddEditEnum.ADD ? await jobSave(formData.value) : await jobUpdate(formData.value));
      if (res.status === ResponseStatusEnum.OK) {
        DragonNotice.success("操作成功");
        emits("query");
        modalVisible.value = false;
      }
    }

    submitLoading.value = false;
  })
}


/**
 * 对话框关闭触发的事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {
  // 清除表单提示数据
  formRef.value.clearValidate();
  // 清空表单数据
  formData.value = {...initFormData};
  // 回复默认
  isAddEdit.value = AddEditEnum.ADD;

  submitLoading.value = false;
}


defineExpose({
  init: (data: object) => {
    if (coreTool.isNotExist(data)) {
      // 数据不存在是添加
      isAddEdit.value = AddEditEnum.ADD;
      modalVisible.value = true;
    } else {
      // 数据存在是编辑
      isAddEdit.value = AddEditEnum.EDIT;
      functionTool.combineObj(formData.value, data);
      modalVisible.value = true;
    }
  }
});
</script>

<style scoped>

</style>
