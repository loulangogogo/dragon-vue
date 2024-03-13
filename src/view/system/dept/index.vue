
<script lang="ts" setup>
import DragonDept from './dept/index.vue';
import DragonRole from './dragon-role.vue'
import DragonUser from './dragon-user.vue'

import {ref} from "vue";
import {RoleTypeSpecialEnum} from "../../../common/domain/enums";


const props = withDefaults(defineProps<{
  // 高度设置
  contentHeight: number;
}>(), {
  contentHeight: 0,
})

const dragonRoleRef = ref();
const dragonUserRef = ref();

// 纵向分割比
const splitSizeV = ref(0.4);

/**
 * 选择部门
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const selectDept = (deptId:any)=>{
  dragonRoleRef.value.searchByDept(deptId);
  dragonUserRef.value.searchByDept(deptId);
}
</script>


<template>
  <div>
    <a-split class="splitH" default-size="0.3" min="0.2" max="0.6">
      <template #first>
        <div style="padding: 5px">
          <dragon-dept :content-height="contentHeight-5"  @select="selectDept"></dragon-dept>
        </div>
      </template>
      <template #second>
        <div>
          <a-split class="splitV" v-model:size="splitSizeV" direction="vertical" min="0.3" max="0.7">
            <template #first>
              <dragon-role ref="dragonRoleRef" :content-height="contentHeight*splitSizeV-3"/>
            </template>
            <template #second>
              <dragon-user ref="dragonUserRef" :content-height="contentHeight*splitSizeV-3"/>
            </template>
          </a-split>
        </div>
      </template>
    </a-split>
  </div>
</template>

<style scoped>
.splitH {
  height: v-bind(contentHeight+ 'px');
  width: 100%;
  min-width: 500px;
}

.splitV {
  height: v-bind(contentHeight+ 'px');
}
</style>
