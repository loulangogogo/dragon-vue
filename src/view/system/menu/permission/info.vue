<template>
  <a-modal v-model:visible="modalVisible"
           :title="isAddEdit===AddEditEnum.ADD?'权限添加':'权限编辑'"
           title-align="start"
           width="550px"
           :mask-closable="false"
           @close="close">
    <a-form ref="formRef" :model="formData" :rules="formRules">
      <a-form-item field="name" label="名称">
        <a-input v-model="formData.name" placeholder="请输入名称"/>
      </a-form-item>
      <a-form-item  field="code" label="编码">
        <a-input v-model="formData.code" placeholder="请输入编码,不输入后端自动生成"/>
      </a-form-item>
      <a-form-item v-if="isAddEdit===AddEditEnum.EDIT" field="type" label="是否启用">
        <a-radio-group v-model="formData.status">
          <a-radio :value="StatusEnum.ON">是</a-radio>
          <a-radio :value="StatusEnum.OFF">否</a-radio>
        </a-radio-group>
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
import {reactive, ref} from "vue";
import {AddEditEnum, PermissionTypeEnum, StatusEnum} from "../../../../common/domain/enums";
import {permissionSave, permissionUpdate} from "../../../../common/api/system/menu";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {DragonNotice} from "../../../../common/domain/component";

const emits = defineEmits(["queryPermission"]);

const props = defineProps<{
  menuId: any
}>();

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
  name: undefined,
  code: undefined,
  menuId: props.menuId,
  status: StatusEnum.ON
};
const formData = ref({...initFormData})
const formRules = {
  name: {
    required: true,
    message: "名称不能为空"
  },
  status:{
    required: true,
    message: "请选择状态"
  },
};

/**
 * 点击确定按钮
 * @param
 * @return
 * @author     :loulan
 * */
const submit = () => {
  submitLoading.value = true;
  formRef.value.validate(async (errors:any)=>{
    // 如果没有错误进行提交
    if (coreTool.isUndefined(errors)) {
      formData.value.menuId = props.menuId;
      const res:ResponseResult = (isAddEdit.value==AddEditEnum.ADD? await permissionSave(formData.value):await permissionUpdate(formData.value));
      if (res.status === ResponseStatusEnum.OK) {
        DragonNotice.success("操作成功");
        emits("queryPermission");
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
