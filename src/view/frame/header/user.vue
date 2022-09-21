<template>
  <a-dropdown trigger="click" position="br" @select="selectOption" style="min-width: 150px">
    <a-image src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"
             :height="frameHeaderHeight/2"
             :width="frameHeaderHeight/2"
             class="userImg"
             :preview="false" />
    <template #content>
      <a-doption :value="1">个人信息</a-doption>
      <a-doption :value="2">测试</a-doption>
      <a-doption :value="3">退出登录</a-doption>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import {useStore} from 'vuex';
import * as $L from 'owner-tool-js';
import {LocalStorageEnum} from "../../../common/domain/storage";
import {useRouter} from "vue-router";
import {computed, onMounted} from "vue";
import {currentUserInfo} from "../../../common/api/frame";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";

const router = useRouter();

const storeGetters = useStore().getters;
const frameHeaderHeight = computed(() => storeGetters.frameHeaderHeight);

/**
 * 点击选中某个选项
 * @param
 * @return
 * @author     :loulan
 * */
const selectOption = (value: any,ev: Event) => {
  if (value == 1) {

  }else if (value == 2) {

  }else if (value == 3) {
    $L.windowsTool.localStorageTool.del(LocalStorageEnum.token);
    router.push("/login");
  }
}


onMounted(()=>{
  // 登录之后获取当前用户个人信息
  currentUserInfo().then((res:ResponseResult) => {
    if (res.status == ResponseStatusEnum.OK) {
      console.log(res);
    } else {
      // 获取当前用户信息失败，理论上因该退出重新登录的
      console.error("获取用户信息错误。");
    }
  })
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
</style>
