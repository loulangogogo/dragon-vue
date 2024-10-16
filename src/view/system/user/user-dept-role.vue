<template>
  <a-modal v-model:visible="modalVisible"
           title="部门岗位"
           title-align="start"
           width="550px"
           :mask-closable="false"
           @close="close">
    <a-form ref="formRef" :model="formData">
      <a-form-item field="deptId" label="部门">
        <a-tree-select v-model="formData.deptId"
                       :field-names="{
                          key: 'id',
                          title: 'name',
                          icon: 'existIcon'
                        }"
                       :data="deptTreeData"
                       @change="(val:any)=>deptChange(val)"
                       allow-clear
                       placeholder="请选择部门">
        </a-tree-select>
      </a-form-item>
      <a-form-item field="roleId" label="岗位">
        <a-select v-model="formData.roleId" :scrollbar="false" :loading="roleOptionsLoading"
                  placeholder="请选择岗位" allow-clear>
          <a-option v-for="(role,index) in roleOptions" :key="index" :value="role.id">{{ role.name }}</a-option>
        </a-select>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="outline" @click="modalVisible=false">取消</a-button>
      <a-button type="primary" @click="submit" :loading="submitLoading">确定</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>

import {arrayTool, core as coreTool} from 'owner-tool-js';
import {inject, onMounted, ref, watch} from "vue";
import {SpecialValueEnum, StatusEnum} from "../../../common/domain/enums";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {dragonConfirm, DragonNotice} from "../../../common/domain/component";
import {fixUserDeptRole} from "../../../common/api/system/user";
import {getAllDept} from "../../../common/api/system/dept";
import {getRoleByDept} from "../../../common/api/system/role";

const emits = defineEmits(["query"]);

// 确定提交按钮的加载状态
const submitLoading = ref(false);

// 表单的ref
const formRef = ref();
// 模态框的显示状态
const modalVisible = ref(false);
// 表单数据
const initFormData: {
  userId?: number;
  deptId?: number;
  roleId?: number;
} = {
  userId: undefined,
  deptId: undefined,
  roleId: undefined
};
const formData = ref({...initFormData});

const deptTreeData = ref<Array<any>>([]);

const roleOptions = ref<Array<any>>([]);
const roleOptionsLoading = ref(false);


/**
 * 部门选项发生改变
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const deptChange = (val: any) => {
  formData.value.roleId = undefined;
}


/**
 * 注入用户部门角色的获取部门数据的方法
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const userDeptRoleGetDeptData = inject("userDeptRoleGetDeptData",async (deptTreeData:Array<any>) =>{
  deptTreeData.length = 0;
  const res: ResponseResult = await getAllDept(StatusEnum.ON);
  if (ResponseStatusEnum.OK == res.status) {
    deptTreeData.push(...arrayTool.arrayToTree(res.data, "id", "pid", SpecialValueEnum.TOP))
  }
})

/**
 * 获取部门数据
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const getDeptData = async () => {
  await userDeptRoleGetDeptData(deptTreeData.value);
}


/**
 * 点击确定按钮
 * @param
 * @return
 * @author     :loulan
 * */
const submit = async () => {
  // 先进行数据的检查，如果部门为空，这个岗位角色必须为空，如果部门不为空，则岗位角色必须不为空
  if (coreTool.isExist(formData.value.deptId)) {
    if (coreTool.isNotExist(formData.value.roleId)) {
      DragonNotice.error("岗位不能为空");
      return;
    } else {
      // 进行数据更新
      updateData();
    }
  } else {
    // 如果部门为空，那么岗位角色直接设置为空
    formData.value.roleId = undefined;

    // 清空数据要进行提示
    dragonConfirm({
      title: '确认提示',
      content: '您确认要清除用户的部门岗位吗？'
    }).then(()=>{
      // 进行数据的更新
      updateData();
    })
  }
}

/**
 * 进行部门岗位角色数据的更新
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const updateData = () => {
  submitLoading.value = true;
  formRef.value.validate(async (errors: any) => {
    // 如果没有错误进行提交
    if (coreTool.isUndefined(errors)) {
      const res: ResponseResult = await fixUserDeptRole(formData.value);
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
  roleOptions.value = []
  roleOptionsLoading.value = false;

  submitLoading.value = false;
}

/**
 * 监听部门数据的变化
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
watch(() => formData.value.deptId, async (newDeptId: any) => {
  roleOptionsLoading.value = true;
  if (coreTool.isNotExist(newDeptId)) {
    roleOptions.value = [];
  } else {
    const res: ResponseResult = await getRoleByDept(newDeptId);
    if (res.status == ResponseStatusEnum.OK) {
      roleOptions.value = res.data;
    } else {
      roleOptions.value = [];
    }
  }
  roleOptionsLoading.value = false;
})

onMounted(() => {
  getDeptData();
})

defineExpose({
  init: async (data: any) => {
    formData.value.userId = data.id;
    formData.value.deptId = data.dept?.id;
    formData.value.roleId =
        coreTool.isExist(formData.value?.deptId)?
        data.roles?.find((o: any) => formData.value?.deptId == o.deptId)?.id
        :
        undefined;
    modalVisible.value = true;
  }
});
</script>

<style scoped>

</style>
