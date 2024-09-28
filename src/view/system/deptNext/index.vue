<script setup lang="ts">
import DragonDept from '../dept/index.vue';
import {computed, provide} from "vue";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {getCurrentUserNextDept} from "../../../common/api/system/dept";
import {arrayTool, core as coreTool} from "owner-tool-js";
import {PermissionTypeEnum, StatusEnum} from "../../../common/domain/enums";
import {useSystemStore} from "../../../store";
import {UserInfo} from "../../../common/domain/common";
import {getCurrentUserPermissionByCurrentUserMenuId, queryCurrentUserAllMenu} from "../../../common/api/system/menu";
import {permissionMenuSaveAndUpdateByCurrentUser} from "../../../common/api/system/role";

const props = withDefaults(defineProps<{
  // 高度设置
  contentHeight: number;
}>(), {
  contentHeight: 0,
})

const store = useSystemStore();
const currentUser = computed<UserInfo>(() => store.userInfo);

// 生成部门树
provide("generateDeptTree", async (parentTreeData: Array<any>, deptTreeData: Array<any>) => {
  deptTreeData.length = 0;
  parentTreeData.length = 0;
  if (coreTool.isNotExist(currentUser.value.dept)) {
    // 如果当前用户没有部门，直接返回不用查了
    return;
  }
  const res: ResponseResult = await getCurrentUserNextDept(StatusEnum.ON);
  if (res.status === ResponseStatusEnum.OK && res.data) {
    if (res.data?.length > 0) {
      deptTreeData.push(...(arrayTool.arrayToTree(res.data, "id", "pid", currentUser.value.dept.pid)));
      parentTreeData.push(...deptTreeData)
    }
  }
})

// 提供用户部门角色获取用户部门数据的方法
provide("userDeptRoleGetDeptData",async (deptTreeData:Array<any>) =>{
  deptTreeData.length = 0;
  if (coreTool.isNotExist(currentUser.value.dept)) {
    // 如果当前用户没有部门，直接返回不用查了
    return;
  }
  const res: ResponseResult = await getCurrentUserNextDept(StatusEnum.ON);
  if (res.status === ResponseStatusEnum.OK && res.data) {
    if (res.data?.length > 0) {
      deptTreeData.push(...(arrayTool.arrayToTree(res.data, "id", "pid", currentUser.value.dept.pid)));
    }
  }
})

// 是否显示部门的编辑删除按钮
provide("deptIsVisibleEditDelButton", false);
provide("deptIsVisibleAddButton", false);

// 菜单查询（角色授权的时候使用）
provide("menuQuery",async ():Promise<ResponseResult>=>{
  return await queryCurrentUserAllMenu();
})

// 权限查询（角色授权的时候使用）
provide("permissionQuery",async (menuIdParam:any,permissionType:PermissionTypeEnum):Promise<ResponseResult> =>{
  return await getCurrentUserPermissionByCurrentUserMenuId(menuIdParam, permissionType);
})
// 角色全新啊数据的提交
provide("rolePermissionSubmit", async (roleIdParam: number, permissionParam: any): Promise<ResponseResult> => {
  return await permissionMenuSaveAndUpdateByCurrentUser(roleIdParam, permissionParam);
});
</script>

<template>
  <dragon-dept :content-height="props.contentHeight"></dragon-dept>
</template>

<style scoped>

</style>