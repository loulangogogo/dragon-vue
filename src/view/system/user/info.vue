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
      <a-form-item field="pid" label="部门">
        <a-tree-select v-model="formData.deptId"
                       :field-names="{
                          key: 'id',
                          title: 'name'
                        }"
                       :data="deptTreeData"
                       @change="deptChange"
                       placeholder="请选择部门">
        </a-tree-select>
      </a-form-item>
      <a-form-item field="roleIds" label="岗位角色">
        <a-select v-model="formData.roleIds" :scrollbar="false" :loading="roleSelectLoading" placeholder="请选择角色数据" :multiple="formData.deptId == SpecialValueEnum.TOP">
          <a-optgroup v-if="coreTool.isNotExist(formData.deptId)" >

          </a-optgroup>
          <a-optgroup v-else-if="formData.deptId == SpecialValueEnum.TOP" v-for="(roleType,index) in roleSelectData.roleTypeOptions" :label="roleType.name" :key="index">
            <template  v-for="(role,index) in roleSelectData.roleOptions" :key="index">
              <a-option v-if="role.typeId==roleType.id" :value="role.id">{{role.name}}</a-option>
            </template>
          </a-optgroup>
          <a-optgroup v-else label="部门岗位">
            <template  v-for="(role,index) in roleSelectData.roleOptions" :key="index">
              <a-option :value="role.id">{{role.name}}</a-option>
            </template>
          </a-optgroup>
        </a-select>
      </a-form-item>
      <a-form-item field="birthday" label="出生日期">
        <a-date-picker v-model="formData.birthday" placeholder="请输入出生日期" style="width: 100%"/>
      </a-form-item>
      <a-form-item v-if="false" field="idCard" label="身份证号码">
        <a-input v-model="formData.idCard" placeholder="请输入身份证号码"/>
      </a-form-item>
      <a-form-item v-if="isAddEdit===AddEditEnum.EDIT" field="status" label="是否启用">
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

import {arrayTool, core as coreTool, functionTool} from 'owner-tool-js';
import {computed, onMounted, reactive, ref} from "vue";
import {
  AddEditEnum,
  MenuTypeEnum,
  StatusEnum,
  UserStatusEnum,
  SexEnum,
  RoleTypeSpecialEnum, SpecialValueEnum
} from "../../../common/domain/enums";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {DragonNotice} from "../../../common/domain/component";
import {userSave, userUpdate} from "../../../common/api/system/user";
import {getRoleByDept, getRoleByNoType, getRoleList, getRoleType} from "../../../common/api/system/role";
import {getAllDept, getCurrentUserNextDept} from "../../../common/api/system/dept";
import {useStore} from "vuex";
import {UserInfo} from "../../../common/domain/common";

const props = withDefaults(defineProps<{
  // 下级部门管理菜单，只能操作当前用户下级部门
  isNextDept:boolean
}>(), {
  // 下级部门管理菜单，只能操作当前用户下级部门
  isNextDept:false
})

const emits = defineEmits(["query"]);

// 确定提交按钮的加载状态
const submitLoading = ref(false);
// 角色下拉框的加载状态
const roleSelectLoading = ref(false);

// 当前是添加还是编辑，默认添加
const isAddEdit = ref(AddEditEnum.ADD);

// 表单的ref
const formRef = ref();
// 模态框的显示状态
const modalVisible = ref(false);
// 表单数据
const initFormData:{
  username: any,
  name: any,
  sex: any,
  birthday: any,
  idCard:any,
  status: number,
  roleIds: any,
  deptId: any,
} = {
  username: undefined,
  name: undefined,
  sex: undefined,
  birthday: undefined,
  idCard:undefined,
  status: UserStatusEnum.NORMAL,
  roleIds: undefined,
  deptId: undefined,
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

// 部门下拉框的数据
const deptOptions = ref([]);

const storeGetters = useStore().getters;
const currentUser = computed<UserInfo>(()=>storeGetters.userInfo);


// 部门树
const deptTreeData = computed(() => {
  if (coreTool.isNotEmpty(deptOptions.value)) {
    const dirData: Array<any> = functionTool.deepCopy(deptOptions.value);
    if (props.isNextDept) {
      dirData.push({
        id: currentUser.value.deptId,
        name: currentUser.value.deptName,
        pid: -2
      });
    }
    return arrayTool.arrayToTree(dirData, "id", "pid", -2);
  } else {
    return [];
  }
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

      // 因为roleIds在部门岗位角色下是单选不是数组，所以这里需要进行判断然后转换为数组
      if (coreTool.isExist(formData.value.roleIds) && !coreTool.is(Array,formData.value.roleIds)) {
        formData.value.roleIds=[formData.value.roleIds]
      }


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
 * 部门选择框内容发生改变事件
 * @param       
 * @return
 * @exception  
 * @author     :loulan
 * */
const deptChange = async (value:any)=>{
  // 当选择框的内容发生改变的时候要清除调已经选择的角色
  formData.value.roleIds = undefined;
  await getRoleByDeptId(value);
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

/**
 * 获取部门数据
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const getDept = async ()=>{
  const res: ResponseResult = await (props.isNextDept?getCurrentUserNextDept(StatusEnum.ON):getAllDept(StatusEnum.ON));
  if (ResponseStatusEnum.OK == res.status) {
    deptOptions.value = res.data;
  }
}

/**
 * 通过部门获取角色
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const getRoleByDeptId = async (deptId:any)=>{
  roleSelectLoading.value = true;
  roleSelectData.roleOptions=[];

  if (coreTool.isNotExist(deptId)) {
    // 如果部门不存在
    formData.value.roleIds = undefined;
    return;
  }else if (deptId == SpecialValueEnum.TOP) {
    // 如果是特殊顶级部门(获取非客户端和部门角色的角色数据)
    const res: ResponseResult = await getRoleByNoType([RoleTypeSpecialEnum.CLIENT,RoleTypeSpecialEnum.DEPT],StatusEnum.ON);
    if (ResponseStatusEnum.OK == res.status) {
      roleSelectData.roleOptions = res.data;
    }
  } else {
    // 如果是普通部门
    const res: ResponseResult = await getRoleByDept(deptId);
    if (ResponseStatusEnum.OK == res.status) {
      roleSelectData.roleOptions = res.data;
    }
  }
  roleSelectLoading.value = false;
}

/**
 * 获取角色类型
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const getRoleAllType = async ()=>{
  const res: ResponseResult = await getRoleType();
  if (ResponseStatusEnum.OK == res.status) {
    roleSelectData.roleTypeOptions = res.data.filter((o:any)=>(RoleTypeSpecialEnum.CLIENT != o.id && RoleTypeSpecialEnum.DEPT != o.id));
  }
}

onMounted(async ()=>{
  await getDept();
  await getRoleAllType();
})

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
      // 获取用户部门的角色
      await getRoleByDeptId(formData.value.deptId);
      modalVisible.value = true;
    }
  }
});
</script>

<style scoped>

</style>
