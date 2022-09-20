<template>
  <a-menu
      class="menuClass"
      theme="dark"
      :collapsed="collapsed"
      :default-open-keys="['0']"
      :default-selected-keys="['0_2']">
    <!--    <a-sub-menu key="0">
          <template #icon><icon-apps></icon-apps></template>
          <template #title>Navigation 1</template>
          <a-menu-item key="0_0">Menu 1</a-menu-item>
          <a-menu-item key="0_1">Menu 2</a-menu-item>
          <a-menu-item key="0_2">Menu 3</a-menu-item>
          <a-menu-item key="0_3">Menu 4</a-menu-item>
        </a-sub-menu>-->
    <router-link v-for="(menu,index) in menus" :key="menu.id" :to="'/'+menu.code+'-'+menu.id">
      <a-menu-item :key="menu.id">
        {{ menu.name }}
      </a-menu-item>
    </router-link>
  </a-menu>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";
import * as $L from 'owner-tool-js';
import {Menu} from "../../../common/domain/common";

const storeGetters = useStore().getters;
const frameSiderHeight = computed(() => storeGetters.frameSiderHeight);
const menus = computed(() => {
  return $L.arrayTool.arrayToTree(storeGetters.menus, "id", "pid", -1);
});
</script>

<style scoped>
.menuClass {
  height: v-bind(frameSiderHeight+ 'px');
}
</style>
