<template>
  <a-menu
      class="menuClass"
      theme="dark"
      :accordion="true"
      :collapsed="collapsed">
    <menu-visible :menus="menus"></menu-visible>
  </a-menu>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import {useSystemStore} from "../../../store";
import {arrayTool} from 'owner-tool-js';
import {Menu} from "../../../common/domain/common";
import MenuVisible from "./menu-visible.vue";


const store = useSystemStore();
const frameSiderHeight = computed(() => store.frameSiderHeight);
const menus = computed((): Array<Menu> => {
  return arrayTool.arrayToTree(store.menus, "id", "pid", -1);
});


defineProps({
  collapsed: {
    type: Boolean,
    required: false,
    default: false
  }
});
</script>

<style scoped>
.menuClass {
  height: v-bind(frameSiderHeight+ 'px');
  user-select: none;
}
</style>
