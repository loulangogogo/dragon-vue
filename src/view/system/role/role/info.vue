<template>
  <a-modal v-model:visible="modalVisible"
           :title="isAddEdit===AddEditEnum.ADD?'添加':'编辑'"
           title-align="start"
           width="550px"
           :mask-closable="false"
           @close="close">
    <a-form ref="formRef" :model="formData" :rules="formRules">
      <a-form-item field="name" label="名称">
        <a-input v-model="formData.name" placeholder="请输入名称"/>
      </a-form-item>
      <a-form-item field="nt" label="备注">
        <a-textarea v-model="formData.nt"
                    :auto-size="{
                      minRows:5,
                      maxRows:10
                    }"
                    placeholder="请输入备注"/>
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
import {inject, ref} from "vue";
import {AddEditEnum} from "../../../../common/domain/enums";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {DragonMessage, DragonNotice} from "../../../../common/domain/component";
import {roleSave, roleUpdate} from "../../../../common/api/system/role";

const emits = defineEmits(["queryRole"]);

// 确定提交按钮的加载状态
const submitLoading = ref(false);

const props = withDefaults(defineProps<{
  // 角色类型
  roleTypeId:number,
}>(),{
  roleTypeId: undefined,
})

// 当前是添加还是编辑，默认添加
const isAddEdit = ref(AddEditEnum.ADD);

// 表单的ref
const formRef = ref();
// 模态框的显示状态
const modalVisible = ref(false);
// 表单数据
const initFormData = {
  name: undefined,
  nt: undefined,
  typeId: props.roleTypeId
};
const formData = ref({...initFormData})
const formRules = {
  name: {
    required: true,
    message: "名称不能为空"
  },
  nt: {
    nt: true,
    message: "备注不能为空"
  }
};

/**
 * 角色添加方法注入
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const roleAddData:Function = inject("roleAddData",async (formParam:any):Promise<ResponseResult>=>{
  return await roleSave(formParam);
})

/**
 * 角色数据的更行
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const roleUpdateData:Function = inject("roleUpdateData",async (formParam:any):Promise<ResponseResult>=>{
  return await roleUpdate(formParam);
})

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
      formData.value.typeId = props.roleTypeId;
      const res: ResponseResult = (isAddEdit.value == AddEditEnum.ADD ? await roleAddData(formData.value) : await roleUpdateData(formData.value));
      if (res.status === ResponseStatusEnum.OK) {
        DragonNotice.success("操作成功");
        emits("queryRole");
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
