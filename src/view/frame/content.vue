<template >
  <div class="titleBlockDiv">
    <title-block :height="frameContentTitleHeight" @change-collapsed="(collapsed:boolean)=>$emit('changeCollapsed',collapsed)"/>
  </div>
  <div class="contentDiv">
    <router-view :content-height="frameContentHeight"/>
  </div>
</template>

<script lang="ts" setup>
import TitleBlock from "./content/title-block.vue";
import {useSystemStore} from "../../store";
import {computed, getCurrentInstance, ref} from "vue";
defineEmits(["changeCollapsed"]);


const store = useSystemStore();
const frameContentTitleHeight = store.frameContentTitleHeight-1; // 这里进行-1是因为边框底部设置了线宽1px
const frameContentHeight = computed(()=>store.frameContentHeight);


</script>

<style scoped>
.titleBlockDiv {
  background-color: white;
  height: v-bind(frameContentTitleHeight+'px');
  border-bottom: 1px solid rgba(61, 60, 60, 0.99);
  overflow: hidden;
}

.contentDiv {
  background-color: white;
  height: v-bind(frameContentHeight+'px');
  overflow: auto;
}
</style>
