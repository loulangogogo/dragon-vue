<template>
  <template v-for="(menu,index) in menus" :key="menu.id">
    <router-link v-if="menu.type===MenuTypeEnum.MENU" :to="'/'+menu.code+'-'+menu.id">
      <a-menu-item :key="menu.id+''">
        <a-space>
          <template v-if="menu.iconType===MenuIconTypeEnum.ICON">
            <component :is="menu.icon" size="22" style="margin: 0px"></component>
          </template>
          <template v-else-if="menu.iconType===MenuIconTypeEnum.ALI">
            <span class="iconfont" :class="menu.icon" style="font-size: 18px"></span>
          </template>
          <template v-else-if="menu.iconType===MenuIconTypeEnum.IMG">
            <a-image width="18" :preview="false" :src="menu.icon"/>
          </template>
          <span style="margin-left: 7px">{{ menu.name }}</span>
        </a-space>
      </a-menu-item>
    </router-link>
    <a-sub-menu v-else-if="menu.type === MenuTypeEnum.DIR" :key="menu.id+''">
      <template #title>
        <a-space>
          <template v-if="menu.iconType===MenuIconTypeEnum.ICON">
            <component :is="menu.icon" size="20" style="margin: 0px"></component>
          </template>
          <template v-else-if="menu.iconType===MenuIconTypeEnum.ALI">
            <span class="iconfont" :class="menu.icon" style="font-size: 18px"></span>
          </template>
          <template v-else-if="menu.iconType===MenuIconTypeEnum.IMG">
            <a-image width="18" :preview="false" :src="menu.icon"/>
          </template>
          <span style="margin-left: 7px">{{ menu.name }}</span>
        </a-space>
      </template>
      <menu-visible v-if="!isEmpty(menu.children)" :menus="menu.children"></menu-visible>
    </a-sub-menu>
  </template>
</template>

<script lang="ts" setup>
import {core as coreTool} from 'owner-tool-js';
import {Menu} from "../../../common/domain/common";
import {MenuIconTypeEnum, MenuTypeEnum} from "../../../common/domain/enums";

/**
 * 判断数据或者字符串是否为空
 * @param
 * @return
 * @author     :loulan
 * */
const isEmpty = (data: any): boolean => coreTool.isEmpty(data);

const {menus} = defineProps<{
  menus: Array<Menu> | undefined
}>();
</script>

<style scoped>

</style>
