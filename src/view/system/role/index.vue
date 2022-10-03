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
          <role :height="contentHeight-10-32" :role-type-id="roleType.id"></role>
        </a-tab-pane>
      </template>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import Role from './role/index.vue';

import {onMounted, ref} from "vue";
import {getRoleType} from "../../../common/api/role";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";

const props = defineProps({
  contentHeight: {
    type: Number,
    required: true,
    default: 0
  }
});

const roleTypes = ref();

/**
 * 点击删除按钮的时候
 * @param
 * @return
 * @author     :loulan
 * */
const del = (key:any)=>{

}

/**
 * 查询角色类型
 * @param
 * @return
 * @author     :loulan
 * */
const queryRoleType = async ()=>{
  const res: ResponseResult = await getRoleType();
  if (res.status === ResponseStatusEnum.OK) {
    roleTypes.value = res.data;
  }
}

onMounted(async ()=>{
  queryRoleType();
})
</script>

<style scoped>

</style>
