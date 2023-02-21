<template>
  <a-row style="height: 50%">
    <a-col :span="12" class="card_col">
      <a-card hoverable class="card">
        <user-info></user-info>
      </a-card>
    </a-col>
    <a-col :span="12" class="card_col">
      <a-card hoverable class="card">
        <Password></Password>
      </a-card>
    </a-col>
  </a-row>
  <a-row style="height: 50%">
    <a-col :span="8" class="card_col">
      <a-card hoverable class="card">
        <phone></phone>
      </a-card>
    </a-col>
    <a-col :span="8" class="card_col">
      <a-card hoverable class="card">
        <email></email>
      </a-card>
    </a-col>
    <a-col :span="8" class="card_col">
      <a-card hoverable class="card">
        <wechat></wechat>
      </a-card>
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

/*卡片样式*/
.card {
  height: 100%;
  overflow: hidden;
}
</style>
