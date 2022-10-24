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
      <a-form-item field="sex" label="性别">
        <a-radio-group v-model="formData.sex">
          <a-radio :value="SexEnum.MAN">男</a-radio>
          <a-radio :value="SexEnum.MEN">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="phone" label="手机号码">
        <a-input v-model="formData.phone" placeholder="请输入手机号码"/>
      </a-form-item>
      <a-form-item field="email" label="邮箱">
        <a-input v-model="formData.email" placeholder="请输入邮箱"/>
      </a-form-item>
      <a-form-item field="birthday" label="出生日期">
        <a-date-picker v-model="formData.birthday" placeholder="请输入出生日期" style="width: 100%"/>
      </a-form-item>
      <a-form-item v-if="false" field="idCard" label="身份证号码">
        <a-input v-model="formData.idCard" placeholder="请输入身份证号码"/>
      </a-form-item>
      <a-form-item v-if="isAddEdit===AddEditEnum.EDIT" field="type" label="是否启用">
        <a-radio-group v-model="formData.status">
          <a-radio :value="UserStatusEnum.NORMAL">正常</a-radio>
          <a-radio :value="UserStatusEnum.HANG_UP">挂起</a-radio>
          <a-radio :value="UserStatusEnum.CANCEL">注销</a-radio>
        </a-radio-group>
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
import {reactive, ref} from "vue";
import {AddEditEnum, MenuTypeEnum, StatusEnum, UserStatusEnum,SexEnum} from "../../../common/domain/enums";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {DragonNotice} from "../../../common/domain/component";
import {userSave, userUpdate} from "../../../common/api/system/user";

const emits = defineEmits(["query"]);


// 当前是添加还是编辑，默认添加
const isAddEdit = ref(AddEditEnum.ADD);

// 表单的ref
const formRef = ref();
// 模态框的显示状态
const modalVisible = ref(false);
// 表单数据
const formData = reactive({
  username: undefined,
  name: undefined,
  phone: undefined,
  email: undefined,
  sex: undefined,
  birthday: undefined,
  status: StatusEnum.ON
})
const formRules = {
  name: {
    required: true,
    message: "姓名不能为空"
  },
  username: {
    required: true,
    message: "用户名不能为空"
  },
  sex: {
    required: true,
    message: "性别不能为空"
  }
};

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
      const res: ResponseResult = (isAddEdit.value == AddEditEnum.ADD ? await userSave(formData) : await userUpdate(formData));
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
  // 清空表单数据
  formRef.value.resetFields();
  // 回复默认
  isAddEdit.value = AddEditEnum.ADD;
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
      functionTool.combineObj(formData, data);
      modalVisible.value = true;
    }
  }
});
</script>

<style scoped>

</style>
