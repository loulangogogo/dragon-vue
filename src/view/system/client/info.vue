<template>
  <a-modal v-model:visible="modalVisible"
           :title="isAddEdit===AddEditEnum.ADD?'客户端添加':'客户端编辑'"
           title-align="start"
           width="550px"
           :mask-closable="false"
           layout="horizontal"
           :auto-label-width="true"
           @close="close">
    <a-form ref="formRef" :model="formData" :rules="formRules">
      <a-form-item field="code" label="编码">
        <a-input v-model="formData.code" placeholder="请输入客户端编码"/>
      </a-form-item>
      <a-form-item field="authorizedGrantTypes" label="授权类型">
        <a-select v-model="formData.authorizedGrantTypes" placeholder="请选择授权类型" :multiple="true">
          <a-option :value="GrantTypeEnum.AUTHORIZATION_CODE">授权码模式</a-option>
          <a-option :value="GrantTypeEnum.CLIENT_CREDENTIALS">客户端模式</a-option>
          <a-option :value="GrantTypeEnum.IMPLICIT">简单模式</a-option>
          <a-option :value="GrantTypeEnum.PASSWORD">密码模式</a-option>
          <a-option :value="GrantTypeEnum.REFRESH_TOKEN">REFRESH_TOKEN</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="redirectUri" label="重定向URI">
        <a-input v-model="formData.redirectUri" placeholder="请输入重定向地址"/>
      </a-form-item>
      <a-form-item field="roleIds" label="角色">
        <a-select v-model="formData.roleIds" placeholder="请选择角色数据" multiple>
          <a-optgroup v-for="(roleType,index) in roleSelectData.roleTypeOptions" :label="roleType.name" :key="index">
            <template  v-for="(role,index) in roleSelectData.roleOptions" :key="index">
              <a-option v-if="role.typeId==roleType.id" :value="role.id">{{role.name}}</a-option>
            </template>
          </a-optgroup>
        </a-select>
      </a-form-item>
      <a-form-item field="accessTokenValidity" label="token有效时间" :label-col-props="{span: 6, offset: 0}" :wrapper-col-props="{span: 18, offset: 0}">
        <a-input-number v-model="formData.accessTokenValidity" placeholder="请输入token有效时间"  hide-button>
          <template #suffix>
            <span>秒</span>
          </template>
        </a-input-number>
      </a-form-item>
      <a-form-item field="refreshTokenValidity" label="refreshToken有效时间" :label-col-props="{span: 8, offset: 0}" :wrapper-col-props="{span: 16, offset: 0}">
        <a-input-number v-model="formData.refreshTokenValidity" placeholder="请输入refreshToken有效时间"  hide-button>
          <template #suffix>
            <span>秒</span>
          </template>
        </a-input-number>
      </a-form-item>
      <a-form-item field="autoApprove" label="自动授权">
        <a-radio-group v-model="formData.autoApprove">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="isAddEdit===AddEditEnum.EDIT" field="status" label="是否启用">
        <a-radio-group v-model="formData.status">
          <a-radio :value="StatusEnum.ON">启用</a-radio>
          <a-radio :value="StatusEnum.OFF">禁止</a-radio>
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
import {reactive, ref,onMounted} from "vue";
import {AddEditEnum, GrantTypeEnum, StatusEnum} from "../../../common/domain/enums";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {DragonNotice} from "../../../common/domain/component";
import {clientSave, clientUpdate} from "../../../common/api/system/client";
import {getRoleList, getRoleType} from "../../../common/api/system/role";

const emits = defineEmits(["query"]);


// 当前是添加还是编辑，默认添加
const isAddEdit = ref(AddEditEnum.ADD);

// 表单的ref
const formRef = ref();
// 模态框的显示状态
const modalVisible = ref(false);

const initFormData = {
  code: undefined,
  authorizedGrantTypes: undefined,
  redirectUri: undefined,
  accessTokenValidity: 3600,
  refreshTokenValidity: 3600,
  autoApprove: false,
  status: StatusEnum.ON,
  roleIds: undefined
};
// 表单数据
const formData = ref({...initFormData})

const formRules = {
  code: {
    required: true,
    message: "编码不能为空"
  },
  authorizedGrantTypes: {
    required: true,
    message: "授权类型不能为空"
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
      const res: ResponseResult = (isAddEdit.value == AddEditEnum.ADD ? await clientSave(formData.value) : await clientUpdate(formData.value));
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
