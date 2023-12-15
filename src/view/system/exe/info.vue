<template>
  <a-modal v-model:visible="modalVisible"
           :title="(isAddEdit===AddEditEnum.ADD?'可执行语句添加':'可执行语句编辑')+'【/commonExe/execute/{code}】'"
           title-align="start"
           width="950px"
           :mask-closable="false"
           layout="horizontal"
           :auto-label-width="true"
           @close="close">
    <a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
      <a-split v-model:size="splitValue" style="width: 100%;height: 550px">
        <template #first>
          <div style="padding-right: 5px">
            <a-form-item field="content">
              <a-textarea v-model="formData.content"
                          :auto-size="{
                            minRows:22,
                            maxRows:22
                          }"
                          placeholder="请输入内容"/>
              <template #label>
                <span>执行内容</span>
                &nbsp;
                <a-tooltip>
                  <icon-question-circle size="16"/>
                  <template #content>
                    <div>默认变量：</div>
                    <div>CURRENT_CLIENT_ID (当前客户端ID)</div>
                    <div>CURRENT_CLIENT_CODE (当前客户端code)</div>
                    <div>CURRENT_USER_ID (当前用户ID)</div>
                    <div>CURRENT_USER_USERNAME (当前用户用户名)</div>
                  </template>
                </a-tooltip>
              </template>
            </a-form-item>
          </div>
        </template>
        <template #second>
          <div style="padding-left: 5px">
            <a-form-item field="code" label="编码">
              <a-input v-model="formData.code" placeholder="编码自动生成" :disabled="true"/>
              <template #extra>
                <div>只能是英文字母，数字和下划线。</div>
              </template>
            </a-form-item>
            <a-form-item field="name" label="名称">
              <a-input v-model="formData.name" placeholder="请输入名称"/>
            </a-form-item>
            <a-form-item field="type" label="类型">
              <a-select v-model="formData.type" :scrollbar="false" placeholder="请选择类型">
                <a-option v-for="(typeOption,index) in typeOptions" :value="typeOption.code">{{
                    typeOption.name
                  }}
                </a-option>
              </a-select>
              <template #extra>
                <div>请与执行内容语句匹配。</div>
                <div v-if="formData.type===5">可以不写 LIMIT 语句。只需要添加参数pageCurrent和pageSize即可</div>
              </template>
            </a-form-item>
            <a-form-item field="resultCamel" label="是否驼峰">
              <a-switch v-model="formData.resultCamel" style="width: 50px"/>
            </a-form-item>
            <a-form-item v-if="isAddEdit===AddEditEnum.EDIT" field="status" label="是否启用">
              <a-radio-group v-model="formData.status">
                <a-radio :value="StatusEnum.ON">启用</a-radio>
                <a-radio :value="StatusEnum.OFF">禁止</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item field="nt" label="备注">
              <a-textarea v-model="formData.nt"
                          :auto-size="{
                      minRows:3,
                      maxRows:5
                    }"
                          placeholder="请输入备注"/>
            </a-form-item>
          </div>
        </template>
      </a-split>
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
import {AddEditEnum, StatusEnum} from "../../../common/domain/enums";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {DragonNotice} from "../../../common/domain/component";
import {exeSave, exeUpdate} from "../../../common/api/system/exe";

const emits = defineEmits(["query"]);

const props = defineProps({
  typeOptions: {
    type: Array<{
      code: string,
      name: string
    }>,
    required: true,
    default: []
  }
});

let splitValue = 0.5;

// 确定提交按钮的加载状态
const submitLoading = ref(false);

// 当前是添加还是编辑，默认添加
const isAddEdit = ref(AddEditEnum.ADD);

// 表单的ref
const formRef = ref();
// 模态框的显示状态
const modalVisible = ref(false);

const initFormData = {
  code: undefined,
  name: undefined,
  content: undefined,
  resultCamel: false,
  type: 10,
  status: StatusEnum.ON,
  nt:undefined
};
// 表单数据
const formData = ref({...initFormData})

const formRules = {
  name: {
    required: true,
    message: "名称不能为空"
  },
  content: {
    required: true,
    message: "内容不能为空"
  },
  type: {
    required: true,
    message: "类型不能为空"
  },
  resultCamel: {
    required: true,
    message: "请选择是否驼峰"
  },
  status: {
    required: true,
    message: "状态不能为空"
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
      const res: ResponseResult = (isAddEdit.value == AddEditEnum.ADD ? await exeSave(formData.value) : await exeUpdate(formData.value));
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
