<template>
  <a-card hoverable class="card">
    <template #extra>
      <a-button type="outline">修改密码</a-button>
    </template>
    <icon-eye-invisible style="width: 50%;height: 50%;max-width: 150px;min-width: 50px;position: relative;top: 30px"/>
  </a-card>
</template>

<script setup lang="ts">

import {UserInfo} from "../../../../common/domain/common";

// 绑定修改数据之后需要重新获取当前用户信息，修改存在store中的当前用户信息
const emits = defineEmits(["reset-user-info"]);
// 用户信息
const {userInfo} = defineProps<{
  userInfo: UserInfo
}>();

</script>

<style scoped>
/*卡片样式*/
.card {
  height: 100%;
  overflow: hidden;
  text-align: center;
}
</style>
