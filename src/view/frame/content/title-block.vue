<template>
  <table class="contentTitleTable">
    <tr>
      <td :style="{width: height+'px'}">
        <span @click="changeCollapsed" class="collapsedSpanClass">
            <icon-menu-fold :size="height*4/6" v-if="!collapsed"/>
            <icon-menu-unfold :size="height*4/6" v-else/>
        </span>
      </td>
      <td style="overflow: hidden;white-space: nowrap">
        <template v-for="(a,index) in 20" :key="index">
          <a-tag size="large"
                 style="margin-left: 10px"
                 :bordered="true"
                 closable>
            <template #icon>
              <icon-star/>
            </template>
            Tag
          </a-tag>
        </template>
      </td>
    </tr>
  </table>
</template>

<script lang="ts" setup>
import {ref} from "vue";

const emit = defineEmits(["changeCollapsed"]);

// 是否折叠
const collapsed = ref(false);

/**
 * 改变折叠的状态
 * @param
 * @return
 * @author     :loulan
 * */
const changeCollapsed = () => {
  collapsed.value = !collapsed.value;
  emit("changeCollapsed", collapsed.value);
}

defineProps({
  height: {
    type: Number,
    require: true,
    default: 39
  }
});
</script>

<style scoped>
.contentTitleTable {
  width: 100%;
  height: v-bind(height+ 'px');
}

.collapsedSpanClass {
  cursor: pointer;
}

.collapsedSpanClass:hover {
  color: blue;
}

</style>
