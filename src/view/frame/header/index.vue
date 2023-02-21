<template>
  <a-dropdown trigger="click" position="br" @select="selectOption" style="min-width: 150px" @popup-visible-change="(visible) => dropdownStatus=visible">
<!--    <a-image src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"
             :height="frameHeaderHeight/2"
             :width="frameHeaderHeight/2"
             class="userImg"
             :preview="false" />-->
    <span class="userTitleSpan">
      {{userInfo.name}}
      <icon-caret-left v-if="!dropdownStatus"/>
      <icon-caret-down v-else/>
    </span>
    <template #content>
      <a-doption :value="1">
        <template #icon><icon-user/></template>
        <template #default>个人中心</template>
      </a-doption>
      <a-doption :value="2">
        <template #icon><icon-drag-arrow /></template>
        <template #default>测试</template>
      </a-doption>
      <a-doption :value="3">
        <template #icon><icon-reply /></template>
        <template #default>退出登录</template>
      </a-doption>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import {useStore} from 'vuex';
import * as $L from 'owner-tool-js';
import {LocalStorageEnum} from "../../../common/domain/storage";
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {currentUserInfo} from "../../../common/api/frame";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {UserInfo} from "../../../common/domain/common";

const router = useRouter();
const store = useStore();
const frameHeaderHeight = computed(() => store.getters.frameHeaderHeight);

// 用户的姓名进行展示
const userInfo = computed(() => store.getters.userInfo);

// 下拉弹框的显示状态
const dropdownStatus = ref();

/**
 * 点击选中某个选项
 * @param
 * @return
 * @author     :loulan
 * */
const selectOption = (value: any,ev: Event) => {
  if (value == 1) {
    // 个人信息
    router.push("/user-center")
  }else if (value == 2) {
    // 测试
  }else if (value == 3) {
    // 退出登录
    $L.windowsTool.localStorageTool.del(LocalStorageEnum.token);
    router.push("/login");
  }
}


onMounted(async ()=>{
  // 登录之后获取当前用户个人信息
  const res:ResponseResult = await currentUserInfo();
  if (res.status == ResponseStatusEnum.OK && res.data) {
    const userInfo: UserInfo = res.data;
    store.commit("setUserInfo", userInfo);
  } else {
    // 获取当前用户信息失败，理论上因该退出重新登录的
    console.error("获取用户信息错误。");
  }
})
</script>

<style scoped>
.userImg {
  border-radius: v-bind(frameHeaderHeight/2+'px');
  position: absolute;
  right: 20px;
  top:v-bind(frameHeaderHeight/4+'px');
  cursor: pointer;
}

.userTitleSpan{
  position: absolute;
  right: 20px;
  cursor: pointer;
  font-size: v-bind(frameHeaderHeight/4+'px');
  top:v-bind(frameHeaderHeight/2-frameHeaderHeight/8+'px');
  font-weight: bolder;
  color: white;
  user-select: none;
}
</style>
