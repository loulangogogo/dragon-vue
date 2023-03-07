<template>
  <span>{{countdown}}</span>
</template>

<script lang="ts" setup>

import {ref, watch} from "vue";
import {core as coreTool} from "owner-tool-js";

const emits = defineEmits(['finish']);

const props = withDefaults(defineProps<{
  start: boolean;
  seconds: number;
}>(),{
  start: true,
  seconds: 100
})

// 倒计数
const countdown = ref();

// 定时器
let intervalTimer:number|undefined = undefined;

// 监听倒计时是否开始
watch(()=>props.start,
    (val,oldVal)=>{
      if (val === true && val !== oldVal) {
        countdown.value = props.seconds;
        intervalTimer = setInterval(()=>{
          if (countdown.value > 0) {
            countdown.value--;
          } else {
            countdown.value = 0;
            if (coreTool.isExist(intervalTimer)) {
              clearInterval(intervalTimer);
            }
            emits('finish');
          }
        },1000)
      } else {
        if (coreTool.isExist(intervalTimer)) {
          clearInterval(intervalTimer);
        }
      }
    },
    {
      immediate: true
    })
</script>

<style scoped>

</style>
