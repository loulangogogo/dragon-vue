<template>
  <a-split :style="{
        height: contentHeight+'px',
        width: '100%',
        minWidth: '500px',
      }"
           v-model:size="splitSize"
  >
    <template #first>
      <type :content-height="contentHeight" @query="query"></type>
    </template>
    <template #second>
      <dict ref="dictRef" :content-height="contentHeight"></dict>
    </template>
  </a-split>
</template>

<script setup lang="ts">
import Dict from "./dict.vue";
import Type from "./type.vue";
import {ref} from "vue";

const splitSize = ref(0.5);

const props = defineProps({
  contentHeight: {
    type: Number,
    required: true,
    default: 0
  }
});

const dictRef = ref();


/**
 * 当点击查询的时候
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const query = (data:any)=>{
  dictRef.value.queryByType(data);
}
</script>

<style scoped lang="scss">

</style>