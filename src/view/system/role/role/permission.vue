<template>
  <a-modal v-model:visible="modalVisible"
           title="编辑权限"
           title-align="start"
           width="90%"
           :mask-closable="false"
           body-class="permissionModalBodyClass"
           @close="close">
    <!--48表示头部高度，53表示脚部高度，20表示空隙高度-->
    <div :style="{height:screenHeight - 48 - 53  - 20 +'px'}">
      <menu-permission ref="menuPermissionRef"
                       :is-role-permission="true"
                       v-model:menu-check-selected-keys="menuCheckSelectedKeys"
                       v-model:table-check-selected-keys="tableCheckSelectedKeys"
                       :content-height="screenHeight - 48 - 53 - 20"></menu-permission>
    </div>
    <template #footer>
      <a-button type="outline" @click="modalVisible=false">取消</a-button>
      <a-button type="primary" @click="submit">确定</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>

import {computed, inject, provide, ref} from "vue";
import {useSystemStore} from "../../../../store";
import MenuPermission from '../../menu/index.vue';
import {getPermissionMenuByRoleId, permissionMenuSaveAndUpdate} from "../../../../common/api/system/role";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {RoleResourcesTypeEnum} from "../../../../common/domain/enums";
import {dragonConfirm, DragonNotice} from "../../../../common/domain/component";


const modalVisible = ref(false);

const menuPermissionRef = ref();

const store = useSystemStore();
const screenHeight = computed(() => store.screenHeight);

// 当前角色id
const currentRoleId = ref();

// 权限选择的数据
const tableCheckSelectedKeys = ref<Array<any>>([]);
const menuCheckSelectedKeys = ref<Array<any>>([]);

// 菜单复选框选中项
provide("menuCheckSelectedKeys", menuCheckSelectedKeys);
// 权限复选框选中项
provide("tableCheckSelectedKeys", tableCheckSelectedKeys);
// 菜单权限是否显示复选框按钮
provide("menuPermissionIsVisibleCheckButton", true);
// 菜单权限是否显示添加按钮
provide("menuPermissionIsVisibleAddButton", false);
// 菜单是否显示操作按钮（编辑删除）
provide("menuIsVisibleOptButton", false);
// 是否显示权限url部分
provide("permissionUrlIsVisible", false);
// 权限菜单列表
provide("permissionColumns", [
  {
    title: "名称",
    dataIndex: "name",
    ellipsis: true,
    tooltip: true,
    width: 300,
  },
  {
    title: "编码",
    dataIndex: "code",
    ellipsis: true,
    tooltip: true
  }
]);


/**
 * 角色权限数据的提交
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const rolePermissionSubmit:Function = inject("rolePermissionSubmit",async (roleIdParam:number,permissionParam:any):Promise<ResponseResult>=>{
  return await permissionMenuSaveAndUpdate(roleIdParam,permissionParam);
})

const submit = () => {
  dragonConfirm({
    title: '确认提示',
    content: '您确认提交数据吗？'
  }).then(async () => {
    // 如果是下级部门只能编辑提交当前用户拥有的权限数据
    const res: ResponseResult = await rolePermissionSubmit(currentRoleId.value, {
      menus: menuCheckSelectedKeys.value,
      permissions: tableCheckSelectedKeys.value
    });
    if (res.status === ResponseStatusEnum.OK) {
      modalVisible.value = false;
      DragonNotice.success("操作成功");
    }
  })
}

/**
 * 模态框关闭事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {
  tableCheckSelectedKeys.value = [];
  menuCheckSelectedKeys.value = [];
  currentRoleId.value = undefined;
}

defineExpose({
  /**
   * 初始化打开模态框进行授权操作
   * @param
   * @return
   * @author     :loulan
   * */
  init: async (roleId: number) => {
    const res: ResponseResult = await getPermissionMenuByRoleId(roleId);
    if (res.status === ResponseStatusEnum.OK) {
      const datas = res.data;
      let tempMenuKeys: Array<any> = [];
      let tempTableKeys: Array<any> = [];
      for (const data of datas) {
        if (data.resourcesType == RoleResourcesTypeEnum.MENU) {
          tempMenuKeys.push(data.resourcesId);
        } else if (data.resourcesType == RoleResourcesTypeEnum.PERMISSION) {
          tempTableKeys.push(data.resourcesId)
        }
      }

      menuCheckSelectedKeys.value = tempMenuKeys;
      tableCheckSelectedKeys.value = tempTableKeys;
      currentRoleId.value = roleId;
      modalVisible.value = true;
    }
  }
});
</script>

<style>
.permissionModalBodyClass {
  padding: 0px;
}
</style>
