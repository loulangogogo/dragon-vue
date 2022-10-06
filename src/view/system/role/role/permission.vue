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

import {computed, ref} from "vue";
import {useStore} from "vuex";
import MenuPermission from '../../menu/index.vue';
import {getPermissionMenuByRoleId, permissionMenuSaveAndUpdate} from "../../../../common/api/system/role";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {RoleResourcesTypeEnum} from "../../../../common/domain/enums";
import {dragonConfirm, DragonNotice} from "../../../../common/domain/component";

const modalVisible = ref(false);

const menuPermissionRef = ref();

const storeGetters = useStore().getters;
const screenHeight = computed(() => storeGetters.screenHeight);

// 当前角色id
const currentRoleId = ref();

// 权限选择的数据
const tableCheckSelectedKeys = ref();
const menuCheckSelectedKeys = ref();


const submit = ()=>{
  dragonConfirm({
    title: '确认提示',
    content: '您确认提交数据吗？'
  }).then(async ()=>{
    const res:ResponseResult = await permissionMenuSaveAndUpdate(currentRoleId.value, {
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
  init: async (roleId:number) => {
    const res:ResponseResult = await getPermissionMenuByRoleId(roleId);
    if (res.status === ResponseStatusEnum.OK) {
      const datas = res.data;
      let tempMenuKeys = [];
      let tempTableKeys = [];
      for (const data of datas) {
        if (data.resourcesType == RoleResourcesTypeEnum.MENU) {
          tempMenuKeys.push(data.resourcesId);
        }else if (data.resourcesType == RoleResourcesTypeEnum.PERMISSION) {
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
