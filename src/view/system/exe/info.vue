<template>
  <a-modal v-model:visible="modalVisible"
           :title="isAddEdit===AddEditEnum.ADD?'客户端添加':'客户端编辑'"
           title-align="start"
           width="650px"
           :mask-closable="false"
           layout="horizontal"
           :auto-label-width="true"
           @close="close">
    <a-form ref="formRef" :model="formData" :rules="formRules">
      <a-form-item field="code" label="编码">
        <a-input v-model="formData.code" placeholder="请输入编码" :disabled="isAddEdit===AddEditEnum.EDIT"/>
      </a-form-item>
      <a-form-item field="name" label="名称">
        <a-input v-model="formData.name" placeholder="请输入名称"/>
      </a-form-item>
      <a-form-item field="content" label="内容">
        <a-textarea v-model="formData.content"
                    :auto-size="{
                      minRows:7,
                      maxRows:10
                    }"
                    placeholder="请输入内容"/>
      </a-form-item>
      <a-form-item field="type" label="类型">
        <a-select v-model="formData.type" placeholder="请选择类型">
          <a-option :value="ExeTypeEnum.SELECT">SELECT</a-option>
          <a-option :value="ExeTypeEnum.INSERT">INSERT</a-option>
          <a-option :value="ExeTypeEnum.UPDATE">UPDATE</a-option>
          <a-option :value="ExeTypeEnum.DELETE">DELETE</a-option>
        </a-select>
      </a-form-item>
      <a-form-item  field="resultCamel" label="是否驼峰">
        <a-switch v-model="formData.resultCamel"/>
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
    </a-form>
    <template #footer>
      <a-button type="outline" @click="modalVisible=false">取消</a-button>
      <a-button type="primary" @click="submit">确定</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>

import {core as coreTool, functionTool} from 'owner-tool-js';
import {reactive, ref,onMounted} from "vue";
import {AddEditEnum, ExeTypeEnum, GrantTypeEnum, StatusEnum} from "../../../common/domain/enums";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {DragonNotice} from "../../../common/domain/component";
import {clientSave, clientUpdate} from "../../../common/api/system/client";
import {getRoleList, getRoleType} from "../../../common/api/system/role";
import {exeSave, exeUpdate} from "../../../common/api/system/exe";

const emits = defineEmits(["query"]);


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
  type: ExeTypeEnum.SELECT,
  status: StatusEnum.ON
};
// 表单数据
const formData = ref({...initFormData})

const formRules = {
  code: {
    required: true,
    message: "编码不能为空"
  },
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

// 角色下拉框的数据
const roleSelectData = reactive({
  roleTypeOptions: undefined,
  roleOptions: undefined
})

/**
 * 点击确定按钮
 * @param
 * @return
 * @author     :loulan
 * */
const submit = () => {
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
}

onMounted(async ()=>{
  if (coreTool.isEmpty(<any>roleSelectData.roleTypeOptions)) {
    const res: ResponseResult = await getRoleType();
    roleSelectData.roleTypeOptions = res.data;
  }

  if (coreTool.isEmpty(<any>roleSelectData.roleOptions)) {
    const res: ResponseResult = await getRoleList();
    roleSelectData.roleOptions = res.data;
  }
})

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
