<template>
  <a-modal v-model:visible="modalVisible"
           :title="isAddEdit===AddEditEnum.ADD?'用户添加':'用户编辑'"
           title-align="start"
           width="550px"
           :mask-closable="false"
           @close="close">
    <a-form ref="formRef" :model="formData" :rules="formRules">
      <a-form-item field="username" label="用户名">
        <a-input v-model="formData.username" placeholder="请输入用户名"/>
      </a-form-item>
      <a-form-item field="name" label="姓名">
        <a-input v-model="formData.name" placeholder="请输入姓名"/>
      </a-form-item>
      <a-form-item v-if="isAddEdit == AddEditEnum.ADD" field="password" label="密码">
        <a-input v-model="formData.password" placeholder="请输入密码"/>
      </a-form-item>
      <a-form-item field="status" label="用户状态">
        <a-radio-group v-model="formData.status">
          <a-radio :value="UserStatusEnum.NORMAL">正常</a-radio>
          <a-radio :value="UserStatusEnum.HANG_UP">挂起</a-radio>
          <a-radio :value="UserStatusEnum.CANCEL">注销</a-radio>
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
import {inject, ref} from "vue";
import {AddEditEnum, SexEnum, UserStatusEnum} from "../../../common/domain/enums";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {DragonNotice} from "../../../common/domain/component";
import {userSave, userUpdate} from "../../../common/api/system/user";

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
const initFormData: {
  username: any,
  name: any,
  password:any,
  status: number,
} = {
  username: undefined,
  name: undefined,
  password: undefined,
  status: UserStatusEnum.NORMAL,
};
const formData = ref({...initFormData});
const formRules = {
  name: {
    required: true,
    message: "姓名不能为空"
  },
  username: {
    required: true,
    message: "用户名不能为空"
  },
  status: {
    required: true,
    message: "状态不能为空"
  },
};

/**
 * 用户数据的更新操作
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const userUpdateData:Function = inject("userUpdateData", async (param: any): Promise<ResponseResult> => {
  return await userUpdate(param);
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
      const res: ResponseResult = (isAddEdit.value == AddEditEnum.ADD ? await userSave(formData.value) : await userUpdateData(formData.value));
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
  init: async (data: object) => {
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
