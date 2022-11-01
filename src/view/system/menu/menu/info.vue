<template>
  <a-modal v-model:visible="modalVisible"
           :title="isAddEdit===AddEditEnum.ADD?'菜单添加':'菜单编辑'"
           title-align="start"
           width="550px"
           :mask-closable="false"
           @close="close">
    <a-form ref="formRef" :model="formData" :rules="formRules">
      <a-form-item field="name" label="菜单名称">
        <a-input v-model="formData.name" placeholder="请输入菜单名称"/>
      </a-form-item>
      <a-form-item field="type" label="类型">
        <a-radio-group v-model="formData.type">
          <a-radio :value="MenuTypeEnum.MENU">菜单</a-radio>
          <a-radio :value="MenuTypeEnum.DIR">菜单组</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="formData.type===MenuTypeEnum.MENU" field="code" label="编码路径" extra="该参数将作为当前菜单的访问路径">
        <a-input v-model="formData.code" placeholder="请输入编码路径"/>
      </a-form-item>
      <a-form-item v-if="formData.type===MenuTypeEnum.MENU" field="path" label="组件位置" extra="该参数用于绑定菜单和组件的关系">
        <a-input v-model="formData.path" placeholder="请输入组件位置">
          <template #prepend>
            src/
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="pid" label="父级菜单">
        <a-tree-select v-model="formData.pid"
                       :field-names="{
                          key: 'id',
                          title: 'name'
                        }"
                       :data="treeData"
                       placeholder="请选择父级菜单"/>
      </a-form-item>
      <a-form-item v-if="formData.type===MenuTypeEnum.MENU" field="keepAlive" label="是否缓冲" extra="该参数用于确定是否在浏览器缓冲页面">
        <a-switch v-model="formData.keepAlive">
          <template #checked>是</template>
          <template #unchecked>否</template>
        </a-switch>
      </a-form-item>
      <a-form-item v-if="isAddEdit===AddEditEnum.EDIT" field="type" label="是否启用">
        <a-radio-group v-model="formData.status">
          <a-radio :value="StatusEnum.ON">是</a-radio>
          <a-radio :value="StatusEnum.OFF">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="orderNum" label="排序">
        <a-input-number v-model="formData.orderNum" placeholder="请输入" mode="button" :min="0" :step="1" :precision="0" style="width: 50%"/>
      </a-form-item>
      <a-form-item field="iconType" label="图标">
        <a-row>
          <a-col :span="13">
            <a-select v-model="formData.iconType" placeholder="请选择图标类型">
              <a-option :value="MenuIconTypeEnum.ALI">阿里图标库</a-option>
              <a-option :value="MenuIconTypeEnum.IMG">图片图标</a-option>
              <a-option :value="MenuIconTypeEnum.ICON">UI库图标</a-option>
            </a-select>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="10">
            <a-input v-model="formData.icon" placeholder="请输入图标名称"/>
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="outline" @click="modalVisible=false">取消</a-button>
      <a-button type="primary" @click="submit">确定</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>

import {arrayTool, core as coreTool,functionTool} from 'owner-tool-js';
import {computed, reactive, ref} from "vue";
import {AddEditEnum, MenuIconTypeEnum, MenuTypeEnum, StatusEnum} from "../../../../common/domain/enums";
import {menuSave, menuDel, menuUpdate} from "../../../../common/api/system/menu";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {DragonNotice} from "../../../../common/domain/component";

const emits = defineEmits(["queryMenu"]);

const props = defineProps({
  menuData: {
    type: Array,
    required: false,
    default: []
  }
});

// 当前是添加还是编辑，默认添加
const isAddEdit = ref(AddEditEnum.ADD);

// 父级菜单的树数据（只需要展示菜单组文件夹的菜单）
const treeData = computed(()=>{
  if (coreTool.isNotEmpty(props.menuData)) {
    const menuDirData:Array<any> = props.menuData?.filter((o: any) => o.type === MenuTypeEnum.DIR);
    menuDirData.push({
      id: -1,
      name: "顶级",
      pid: -2
    })
    return arrayTool.arrayToTree(menuDirData, "id", "pid", -2);
  } else {
    return [];
  }
})

// 表单的ref
const formRef = ref();
// 模态框的显示状态
const modalVisible = ref(false);
// 表单数据
const initFormData = {
  name: undefined,
  type: MenuTypeEnum.MENU,
  code: undefined,
  path: undefined,
  keepAlive: false,
  pid: -1,
  orderNum: 0,
  iconType: undefined,
  icon: undefined,
  status: StatusEnum.ON
};
const formData = ref({...initFormData});
const formRules = {
  name: {
    required: true,
    message: "菜单名称不能为空"
  },
  type:{
    required: true,
    message: "菜单类型不能为空"
  },
  code:{
    required: true,
    message: "编码路径不能为空"
  },
  path:{
    required: true,
    message: "组件位置不能为空"
  },
  pid:{
    required: true,
    message: "请选择父级菜单"
  },
};

/**
 * 点击确定按钮
 * @param
 * @return
 * @author     :loulan
 * */
const submit = () => {
  formRef.value.validate(async (errors:any)=>{
    // 如果没有错误进行提交
    if (coreTool.isUndefined(errors)) {
      const res:ResponseResult = (isAddEdit.value==AddEditEnum.ADD? await menuSave(formData.value):await menuUpdate(formData.value));
      if (res.status === ResponseStatusEnum.OK) {
        DragonNotice.success("操作成功");
        emits("queryMenu");
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
  // 清空表单数据
  formData.value = {...initFormData};
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
      functionTool.combineObj(formData.value, data);
      modalVisible.value = true;
    }
  }
});
</script>

<style scoped>

</style>
