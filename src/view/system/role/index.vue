<template>
  <div style="padding: 10px" >
    <a-tabs :animation="true" type="rounded" lazy-load>
      <template #extra>
        <a-space>
          <a-button type="primary" status="success" size="small" shape="round">
            <template #icon><icon-plus /></template>
          </a-button>
          <a-button type="primary" size="small" shape="round">
            <template #icon><icon-edit /></template>
          </a-button>
          <a-button type="primary" status="danger" size="small" shape="round">
            <template #icon><icon-delete /></template>
          </a-button>
        </a-space>
      </template>
      <template v-for="(roleType,index) in roleTypes" :key="roleType.id">
        <a-tab-pane  :title="roleType.name">
          <role :height="contentHeight-10-32"></role>
        </a-tab-pane>
      </template>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import Role from './role/index.vue';

import {ref} from "vue";

const props = defineProps({
  contentHeight: {
    type: Number,
    required: true,
    default: 0
  }
});

const roleTypes = [
  {
    id: 1,
    code: 'asdf',
    name: '661'
  },{
    id: 2,
    code: 'asdf1',
    name: '662'
  },{
    id: 3,
    code: 'asdf2',
    name: '663'
  },{
    id: 4,
    code: 'asdf3',
    name: '664'
  }
];



/**
 * 点击删除按钮的时候
 * @param
 * @return
 * @author     :loulan
 * */
const del = (key:any)=>{

}
</script>

<style scoped>

</style>
