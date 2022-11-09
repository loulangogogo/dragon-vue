<template>
  <template v-for="(menu,index) in menus" :key="menu.id">
    <router-link v-if="menu.type===10" :to="'/'+menu.code+'-'+menu.id">
      <a-menu-item :key="menu.id+''">
        <template v-if="menu.iconType===MenuIconTypeEnum.ICON">
          <component :is="menu.icon" size="18"></component>
        </template>
        <template v-else-if="menu.iconType===MenuIconTypeEnum.ALI">
          <span class="iconfont" :class="menu.icon" style="font-size: 18px"></span>
        </template>
        <template v-else-if="menu.iconType===MenuIconTypeEnum.IMG">
          <a-image  width="18" :preview="false" :src="menu.icon"/>
        </template>
        <span style="margin-left: 7px">{{ menu.name }}</span>
      </a-menu-item>
    </router-link>
    <a-sub-menu v-else-if="menu.type === 20" :key="menu.id+''">
      <template #title>
        <template v-if="menu.iconType===MenuIconTypeEnum.ICON">
          <component :is="menu.icon" size="18"></component>
        </template>
        <template v-else-if="menu.iconType===MenuIconTypeEnum.ALI">
          <span class="iconfont" :class="menu.icon" style="font-size: 18px"></span>
        </template>
        <template v-else-if="menu.iconType===MenuIconTypeEnum.IMG">
          <a-image  width="18" :preview="false" :src="menu.icon"/>
        </template>
        <span style="margin-left: 7px">{{ menu.name }}</span>
      </template>
      <menu-visible v-if="!isEmpty(menu.children)" :menus="menu.children"></menu-visible>
    </a-sub-menu>
  </template>
</template>

<script lang="ts" setup>
import * as $L from 'owner-tool-js';
import {Menu} from "../../../common/domain/common";
import {MenuIconTypeEnum} from "../../../common/domain/enums";

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
