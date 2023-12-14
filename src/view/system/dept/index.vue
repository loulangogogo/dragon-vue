
<script lang="ts" setup>
import DragonDept from './dept/index.vue';
import DragonRole from '../role/role/index.vue';

import {ref} from "vue";
import {RoleTypeSpecialEnum} from "../../../common/domain/enums";


const props = withDefaults(defineProps<{
  // 高度设置
  contentHeight: number;
  isNextDept: boolean
}>(), {
  contentHeight: 0,
  isNextDept:false
})

const dragonRoleRef = ref();

/**
 * 选择部门
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const selectDept = (deptId:any)=>{
  dragonRoleRef.value.queryByDept(deptId);
}
</script>


<template>
  <div>
    <a-split class="splitH" default-size="0.3" min="0.2" max="0.6">
      <template #first>
        <div style="padding: 5px">
          <dragon-dept :content-height="contentHeight-5" :is-next-dept="props.isNextDept" @select="selectDept"></dragon-dept>
        </div>
      </template>
      <template #second>
        <div>
          <dragon-role ref="dragonRoleRef" :is-dept="true"
                       :is-next-dept="props.isNextDept"
                       :role-type-id="RoleTypeSpecialEnum.DEPT"
                       :height="contentHeight-5">

          </dragon-role>
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
