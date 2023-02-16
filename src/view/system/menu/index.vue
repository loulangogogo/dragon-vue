<template>
  <div>
    <a-split class="menuSplitH" default-size="0.3" min="0.2" max="0.6">
      <template #first>
        <div style="padding: 5px">
          <dragon-menu ref="menuRef" :height="contentHeight-5"
                       :is-role-permission="isRolePermission"
                       v-model:selectedKeys="menuCheckSelectedKeys"
                       @select-menu="selectMenu"></dragon-menu>
        </div>
      </template>
      <template #second>
        <div>
          <a-split class="menuSplitV" v-model:size="menuSplitSizeV" direction="vertical" min="0.3" max="0.7">
            <template #first>
              <dragon-permission :height="contentHeight*menuSplitSizeV-3" ref="permissionRef"
                                 :is-role-permission="isRolePermission"
                                 v-model:selectedKeys="tableCheckSelectedKeys"></dragon-permission>
            </template>
            <template #second>
              <dragon-component :height="contentHeight*(1-menuSplitSizeV)-3" ref="componentRef"
                                :is-role-permission="isRolePermission"
                                v-model:selectedKeys="tableCheckSelectedKeys"></dragon-component>
            </template>
          </a-split>
        </div>
      </template>
    </a-split>
  </div>
</template>

<script lang="ts" setup>
import DragonMenu from './menu/index.vue';
import DragonPermission from './permission/index.vue';
import DragonComponent from './component/index.vue';
import {ref} from "vue";
import {watch} from "vue";

const emits = defineEmits(['update:tableCheckSelectedKeys','update:menuCheckSelectedKeys']);

const props = defineProps({
  contentHeight: {
    type: Number,
    required: true,
    default: 0
  },
  // 是否是角色权限授权
  isRolePermission: {
    type: Boolean,
    required: false,
    default: false
  },
  // 表格多选情况
  tableCheckSelectedKeys:{
    type: [Array<string|number>],
    required: false,
    default: []
  },
  menuCheckSelectedKeys:{
    type: [Array<string|number>],
    required: false,
    default: []
  }
});

watch(() => props.tableCheckSelectedKeys,
    (val: any) => {
      emits("update:tableCheckSelectedKeys", val);
    },
    {
      deep: true,
      immediate: false
    }
);
watch(() => props.menuCheckSelectedKeys,
    (val: any) => {
      emits("update:menuCheckSelectedKeys", val);
    },
    {
      deep: true,
      immediate: false
    }
);

const menuRef = ref();

// 纵向分割比
const menuSplitSizeV = ref(0.5);

const permissionRef = ref();
const componentRef = ref();

/**
 * 当菜单被点击的时候
 * @param
 * @return
 * @author     :loulan
 * */
const selectMenu = async (menuId: number) => {
  permissionRef.value.init(menuId);
  componentRef.value.init(menuId);
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
