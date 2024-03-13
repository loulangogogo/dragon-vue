<script setup lang="ts">
import RoleComponent from '../role/role/index.vue';
import {RoleTypeSpecialEnum} from "../../../common/domain/enums";
import {provide, ref} from "vue";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {getRoleByDept, roleSave} from "../../../common/api/system/role";
import {core as coreTool} from "owner-tool-js";
import {DragonMessage} from "../../../common/domain/component";

const props = withDefaults(defineProps<{
  contentHeight: number;
}>(),{
  contentHeight: 0,
})

const dragonRoleRef = ref();

const currentDeptId = ref();


defineExpose({
  /**
   * 根据部门查询
   * @param
   * @return
   * @exception
   * @author     :loulan
   * */
  searchByDept: (deptId: any) => {
    currentDeptId.value = deptId;
    dragonRoleRef.value.initSearch(deptId);
  },
});

// 列表
provide("roleColumns",[
  {
    title: "岗位名称",
    dataIndex: "name",
    width: 300,
    fixed: "left",
  },
  {
    title: "备注",
    dataIndex: "nt",
    ellipsis: true,
    tooltip: true
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 80,
    slotName: "fieldStatus",
  },
  {
    title: "操作",
    width: 220,
    fixed: "right",
    slotName: "operate"
  },
]);
// 获取部门角色
provide("getRoleData",async (param:any):Promise<ResponseResult>=>{
  if (coreTool.isNotExist(currentDeptId.value)) {
    return <ResponseResult>{
      data: [],
      msg: "部门id未设置",
      status: ResponseStatusEnum.FAIT,
      taskId: ""
    }
  }
  const res: ResponseResult = await getRoleByDept(currentDeptId.value, param.name);
  return res;
})
// 角色添加，需要设置部门id
provide("roleAddData",async (formParam:any):Promise<ResponseResult>=>{
  if (coreTool.isNotExist(currentDeptId.value)) {
    DragonMessage.warning("请先选择部门");
    return <ResponseResult>{
      data: [],
      msg: "部门id未设置",
      status: ResponseStatusEnum.FAIT,
      taskId: ""
    }
  }
  return await roleSave(formParam,currentDeptId.value);
})
// 角色不分页
provide("roleIsPage", false);

// 角色是否显示查看用户按钮
provide("roleIsVisibleLookUserButton", false)
</script>

<template>
  <role-component ref="dragonRoleRef"
               :role-type-id="RoleTypeSpecialEnum.DEPT"
               :height="contentHeight">
  </role-component>
</template>

<style scoped>

</style>