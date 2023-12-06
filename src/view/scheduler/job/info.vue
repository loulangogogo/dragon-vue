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
        <a-input v-model="formData.applicationName" placeholder="请输入应用名称"/>
      </a-form-item>
      <a-form-item field="cron" label="cron">
        <a-input v-model="formData.cron" placeholder="请输入表达式"/>
      </a-form-item>
      <a-form-item field="mode" label="模式">
        <a-radio-group v-model="formData.mode">
          <a-radio :value="SexEnum.MAN">男</a-radio>
          <a-radio :value="SexEnum.MEN">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="isConcurrent" label="是否并行">
        <a-radio-group v-model="formData.isConcurrent">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item  field="runTime" label="运行时间">
        <a-input v-model="formData.runTime" placeholder="请输入运行时间"/>
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
import {onMounted, reactive, ref} from "vue";
import {AddEditEnum, MenuTypeEnum, StatusEnum, UserStatusEnum,SexEnum} from "../../../common/domain/enums";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {DragonNotice} from "../../../common/domain/component";
import {userSave, userUpdate} from "../../../common/api/system/user";
import {getRoleList, getRoleType} from "../../../common/api/system/role";

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
    message: "姓名不能为空"
  },
  username: {
    required: true,
    message: "用户名不能为空"
  },
  sex: {
    required: true,
    message: "性别不能为空"
  },
  roleIds: {
    required: true,
    message: "角色不能为空"
  },
  status: {
    required: true,
    message: "状态不能为空"
  }
};

// 角色下拉框的数据
const roleSelectData:{
  roleTypeOptions:Array<{
    name:string,
    id:number
  }>,
  roleOptions:Array<{
    name:string,
    id:number,
    typeId: number
  }>,
} = reactive({
  roleTypeOptions: [],
  roleOptions: []
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
      const res: ResponseResult = (isAddEdit.value == AddEditEnum.ADD ? await userSave(formData.value) : await userUpdate(formData.value));
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
