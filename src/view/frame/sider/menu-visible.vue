<template>
  <template v-for="(menu,index) in menus" :key="menu.id">
    <router-link v-if="menu.type===10" :to="'/'+menu.code+'-'+menu.id">
      <a-menu-item :key="menu.id+''">
        <template #icon><icon-arrow-fall /></template>
        {{ menu.name }}
      </a-menu-item>
    </router-link>
    <a-sub-menu v-else-if="menu.type === 20" :key="menu.id+''">
      <template #title>{{menu.name}}</template>
      <template #icon><icon-arrow-fall /></template>
      <menu-visible v-if="!isEmpty(menu.children)" :menus="menu.children"></menu-visible>
    </a-sub-menu>
  </template>
</template>

<script lang="ts" setup>
import * as $L from 'owner-tool-js';
import {Menu} from "../../../common/domain/common";

/**
 * 判断数据或者字符串是否为空
 * @param
 * @return
 * @author     :loulan
 * */
const isEmpty = (data: any): boolean => $L.core.isEmpty(data);

const {menus} = defineProps<{
  menus:Array<Menu>
}>();
</script>

<style scoped>

</style>
