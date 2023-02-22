<template>
  <a-row style="height: 50%">
    <a-col :span="12" class="card_col">
      <user-info></user-info>
    </a-col>
    <a-col :span="12" class="card_col">
      <Password></Password>
    </a-col>
  </a-row>
  <a-row style="height: 50%">
    <a-col :span="8" class="card_col">
      <phone></phone>
    </a-col>
    <a-col :span="8" class="card_col">
      <email></email>
    </a-col>
    <a-col :span="8" class="card_col">
      <wechat></wechat>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import Phone from './user-center/phone.vue';
import Email from './user-center/email.vue';
import Wechat from './user-center/wechat.vue';
import Password from "./user-center/password.vue";
import UserInfo from "./user-center/user-info.vue";
</script>

<style scoped>
/*包含卡片的col的样式*/
.card_col {
  padding: 10px;
  height: 100%;
}
</style>
