<template>
  <a-modal v-model:visible="modalVisible"
           :title="isAddEdit===AddEditEnum.ADD?'部门添加':'部门编辑'"
           title-align="start"
           width="550px"
           :mask-closable="false"
           @close="close">
    <a-form ref="formRef" :model="formData" :rules="formRules">
      <a-form-item field="name" label="部门名称">
        <a-input v-model="formData.name" placeholder="请输入部门名称"/>
      </a-form-item>
      <a-form-item field="code" label="部门编码">
        <a-input v-model="formData.code" placeholder="请输入编码"/>
      </a-form-item>
      <a-form-item field="pid" label="父级部门">
        <a-tree-select v-model="formData.pid"
                       :field-names="{
                          key: 'id',
                          title: 'name',
                          icon: 'existIcon'
                        }"
                       :data="props.deptTree"
                       placeholder="请选择父级部门">
        </a-tree-select>
      </a-form-item>
      <a-form-item  field="status" label="是否启用">
        <!--当菜单为不显示时不需要配置状态因为不显示的菜单状态默认是否-->
        <a-radio-group v-model="formData.status">
          <a-radio :value="StatusEnum.ON">是</a-radio>
          <a-radio :value="StatusEnum.OFF">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="orderNum" label="排序">
        <a-input-number v-model="formData.orderNum" placeholder="请输入" mode="button" :min="0" :step="1" :precision="0"
                        style="width: 50%"/>
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
import {AddEditEnum, StatusEnum} from "../../../../common/domain/enums";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {DragonNotice} from "../../../../common/domain/component";
import {deptSave, deptUpdate} from "../../../../common/api/system/dept";

const emits = defineEmits(["query"]);

const props = withDefaults(defineProps<{
  deptTree: Array<any>
}>(), {
  deptTree: undefined,
})

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
  pid: undefined,
  orderNum: 100,
  status: StatusEnum.ON
};
const formData = ref({...initFormData});
const formRules = {
  name: {
    required: true,
    message: "部门名称不能为空"
  },
  type: {
    required: true,
    message: "部门类型不能为空"
  },
  code: {
    required: true,
    message: "部门编码不能为空"
  },
  pid: {
    required: true,
    message: "请选择父级部门"
  },
  stationId: {
    required: true,
    message: "请选择所属站点"
  },
};


/**
 * 部门添加保存数据
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const deptSaveData:Function = inject("deptSaveData",async (param:any):Promise<ResponseResult>=>{
  return await deptSave(param);
})

/**
 * 部门更新数据
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const deptUpdateData:Function = inject("deptUpdateData",async (param:any):Promise<ResponseResult>=>{
  return await deptUpdate(param);
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
      const res: ResponseResult = (isAddEdit.value == AddEditEnum.ADD ? await deptSaveData(formData.value) : await deptUpdateData(formData.value));
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
