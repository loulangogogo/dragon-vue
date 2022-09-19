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
    <a-menu-item v-for="(menu,index) in menus" :key="menu.id">{{menu.name}}</a-menu-item>
  </a-menu>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {currentUserMenu} from "../../../common/api/frame";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {useStore} from "vuex";

const storeGetters = useStore().getters;
const frameSiderHeight = computed(()=>storeGetters.frameSiderHeight);


const menus = ref([]);


onMounted(()=>{
  currentUserMenu().then((res:ResponseResult) => {
    if (res.status == ResponseStatusEnum.OK) {
      menus.value = res.data;
    }
  })
})
</script>

<style scoped>
.menuClass{
  height: v-bind(frameSiderHeight+'px');
}
</style>
