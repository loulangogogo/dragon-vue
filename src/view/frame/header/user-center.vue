<template>
  <a-row style="height: 50%">
    <a-col :span="12" class="card_col">
      <user-data :user-info="userInfo" @reset-user-info="resetUserInfo"></user-data>
    </a-col>
    <a-col :span="12" class="card_col">
      <Password :user-info="userInfo" @reset-user-info="resetUserInfo"></Password>
    </a-col>
  </a-row>
  <a-row style="height: 50%">
    <a-col :span="8" class="card_col">
      <phone :user-info="userInfo" @reset-user-info="resetUserInfo"></phone>
    </a-col>
    <a-col :span="8" class="card_col">
      <email :user-info="userInfo" @reset-user-info="resetUserInfo"></email>
    </a-col>
    <a-col :span="8" class="card_col">
      <wechat :user-info="userInfo" @reset-user-info="resetUserInfo"></wechat>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import Phone from './user-center/phone.vue';
import Email from './user-center/email.vue';
import Wechat from './user-center/wechat.vue';
import Password from "./user-center/password.vue";
import UserData from './user-center/user-info.vue';
import {computed, ref, watch} from "vue";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {currentUserInfo} from "../../../common/api/frame";
import {dragonConfirm} from "../../../common/domain/component";
import {useStore} from "vuex";
import {functionTool} from "owner-tool-js";

const props = defineProps({
  contentHeight: {
    type: Number,
    required: true,
    default: 0
  }
});

const store = useStore();
// 同步获取用户信息
const userInfo = ref<any>({});
watch(() => store.getters.userInfo,
    (val) => {
      functionTool.combineObj(userInfo.value, val);
    }, {
      deep: true,
      immediate: true
    })

/**
 * 重新设置获取用户信息
 * @param
 * @return
 * @author     :loulan
 * */
const resetUserInfo = async () => {
  // 登录之后获取当前用户个人信息
  const res: ResponseResult = await currentUserInfo();
  if (res.status == ResponseStatusEnum.OK && res.data) {
    store.commit("setUserInfo", res.data);
  } else {
    dragonConfirm({
      content: "更新用户信息失败，请刷新当前页面。"
    });
  }
}

</script>

<style scoped>
/*包含卡片的col的样式*/
.card_col {
  padding: 10px;
  height: 100%;
}
</style>
