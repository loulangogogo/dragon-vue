<template>
  <div style="padding: 10px" >
    <a-tabs :animation="true" type="rounded" lazy-load @change="tabsChange" :default-active-key="currentTabKey">
      <template #extra>
        <a-space>
          <a-button type="primary" status="success" size="small" shape="round" @click="add">
            <template #icon><icon-plus /></template>
          </a-button>
          <a-button type="primary" size="small" shape="round" @click="edit">
            <template #icon><icon-edit/></template>
          </a-button>
          <a-button type="primary" status="danger" size="small" shape="round" @click="del">
            <template #icon><icon-delete /></template>
          </a-button>
        </a-space>
      </template>
      <template v-for="(roleType,index) in roleTypes" :key="index">
        <a-tab-pane  :title="roleType.name">
          <role :height="contentHeight-10-32" :role-type-id="roleType.id"></role>
        </a-tab-pane>
      </template>
    </a-tabs>
  </div>
  <div v-show="false">
    <type-info ref="TypeInfoRef" @query-role-type="queryRoleType"></type-info>
  </div>
</template>

<script lang="ts" setup>
import Role from './role/index.vue';
import TypeInfo from './type/info.vue';
import {onMounted, ref} from "vue";
import {getRoleType, roleTypeDel} from "../../../common/api/system/role";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import * as $L from 'owner-tool-js';
import {dragonConfirm, DragonMessage, DragonNotice} from "../../../common/domain/component";

const props = defineProps({
  contentHeight: {
    type: Number,
    required: true,
    default: 0
  }
});

// 角色类型
const roleTypes = ref();

// 角色类型info的ref
const TypeInfoRef = ref();

// 当前tab的标签的key
const currentTabKey = ref(0);

/**
 * 当标签发生变化的时候
 * @param
 * @return
 * @author     :loulan
 * */
const tabsChange = (key:any)=>{
  currentTabKey.value = key;
}

/**
 * 角色类型添加
 * @param
 * @return
 * @author     :loulan
 * */
const add = ()=>{
  TypeInfoRef.value.init();
}

/**
 * 角色类型的编辑
 * @param
 * @return
 * @author     :loulan
 * */
const edit = () => {
  if ($L.core.isEmpty(roleTypes.value) || roleTypes.value.length <= currentTabKey.value) {
    DragonMessage.error("当前未选中任何橘色类型，无法进行编辑操作。");
    return;
  }
  const data = roleTypes.value[currentTabKey.value];
  TypeInfoRef.value.init(data);
}

/**
 * 点击删除按钮的时候
 * @param
 * @return
 * @author     :loulan
 * */
const del = ()=>{
  if ($L.core.isEmpty(roleTypes.value) || roleTypes.value.length <= currentTabKey.value) {
    DragonMessage.error("当前未选中任何橘色类型，无法进行删除操作。");
    return;
  }
  const data = roleTypes.value[currentTabKey.value];
  dragonConfirm({
    title: '确认提示',
    content: '您确认删除这条数据吗？'
  }).then(async ()=>{
    const res:ResponseResult = await roleTypeDel(data.id);
    if (res.status === ResponseStatusEnum.OK) {
      queryRoleType();
      DragonNotice.success("删除成功");
    }
  })
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
