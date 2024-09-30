<template>
  <div>
    <a-split class="menuSplitH" default-size="0.3" min="0.2" max="0.6">
      <template #first>
        <div style="padding: 5px">
          <dragon-menu ref="menuRef" :height="contentHeight-5" @select-menu="selectMenu"></dragon-menu>
        </div>
      </template>
      <template #second>
        <div v-if="permissionUrlIsVisible">
          <a-split class="menuSplitV" v-model:size="menuSplitSizeV" direction="vertical" min="0.3" max="0.7">
            <template #first>
              <dragon-permission :height="contentHeight*menuSplitSizeV-3" ref="permissionRef"
                                 @selectPermission="selectPermission"></dragon-permission>
            </template>
            <template #second>
              <dragon-permission-url :height="contentHeight*(1-menuSplitSizeV)-3" ref="urlRef"></dragon-permission-url>
            </template>
          </a-split>
        </div>
        <div v-else>
          <dragon-permission :height="contentHeight*menuSplitSizeV-3" ref="permissionRef" @selectPermission="selectPermission"></dragon-permission>
        </div>
      </template>
    </a-split>
  </div>
</template>

<script lang="ts" setup>
import DragonMenu from './menu/index.vue';
import DragonPermission from './permission/index.vue';
import DragonPermissionUrl from './permissionUrl/index.vue'
import {inject, ref} from "vue";

const props = defineProps({
  contentHeight: {
    type: Number,
    required: true,
    default: 0
  },
});

const menuRef = ref();

// 纵向分割比
const menuSplitSizeV = ref(0.5);

const permissionRef = ref();
const urlRef = ref();

// 是否显示权限url部分
const permissionUrlIsVisible = inject("permissionUrlIsVisible", true);

/**
 * 当菜单被点击的时候
 * @param
 * @return
 * @author     :loulan
 * */
const selectMenu = async (menuId: number) => {
  permissionRef.value.init(menuId);
  if (permissionUrlIsVisible) {
    urlRef.value.clear();
  }
}

/**
 * 当权限被点击的时候
 * @param       permissionId 权限id
 * @author     :loulan
 * */
const selectPermission = async (permissionId: number) => {
  if (permissionUrlIsVisible) {
    urlRef.value.init(permissionId);
  }
}
</script>

<style scoped>
.menuSplitH {
  height: v-bind(contentHeight+ 'px');
  width: 100%;
  min-width: 500px;
}

.menuSplitV {
  height: v-bind(contentHeight+ 'px');
}
</style>
