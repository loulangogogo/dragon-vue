<template>
  <a-dropdown trigger="click" position="br" @select="selectOption" style="min-width: 150px" @popup-visible-change="(visible:any) => dropdownStatus=visible">
    <div class="userImg">
      <span style="color: white;font-weight: bolder;margin-right: 5px;">
        {{userInfo.name}}
      </span>
      <a-avatar  style="background-color: rgba(0, 0, 0, 0);"  shape="circle"
     :size="frameHeaderHeight*2/3">
      <img v-if="userInfo?.headerImageFileInfo?.url" :src="userInfo?.headerImageFileInfo?.url" :style="{width:frameHeaderHeight*2/3+'px',height: frameHeaderHeight*2/3+'px',borderRadius:frameHeaderHeight*2/3+'px'}"/>
      <IconUser v-else  :size="frameHeaderHeight/2" color="white"/>
    </a-avatar>
    </div>
    <template #content>
      <a-doption :value="1">
        <template #icon><icon-user/></template>
        <template #default>个人中心</template>
      </a-doption>
      <a-doption :value="2">
        <template #icon><icon-drag-arrow /></template>
        <template #default>反馈建议</template>
      </a-doption>
      <a-doption :value="4">
        <template #icon><icon-stop /></template>
        <template #default>注销账号</template>
      </a-doption>
      <a-doption :value="3">
        <template #icon><icon-reply /></template>
        <template #default>退出登录</template>
      </a-doption>
    </template>
  </a-dropdown>

  <div v-show="false">
    <idea-fun ref="ideaFunRef"></idea-fun>
    <unregister-user ref="unregisterUserRef" @logout="logout"></unregister-user>
  </div>
</template>

<script lang="ts" setup>
import {useStore} from 'vuex';
import {windowsTool} from 'owner-tool-js';
import {LocalStorageEnum} from "../../../common/domain/storage";
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {currentUserInfo} from "../../../common/api/frame";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {UserInfo} from "../../../common/domain/common";
import IdeaFun from './idea-fun.vue';
import UnregisterUser from './unregister-user.vue';
import { dragonConfirm } from '../../../common/domain/component';

const router = useRouter();
const store = useStore();
const frameHeaderHeight = computed(() => store.getters.frameHeaderHeight);

// 用户的姓名进行展示
const userInfo = computed(() => store.getters.userInfo);

// 下拉弹框的显示状态
const dropdownStatus = ref();
const ideaFunRef = ref();
const unregisterUserRef = ref();

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
    // 反馈建议
    ideaFunRef.value.open();
  }else if (value == 3) {
    // 退出登录
    logout();
  }else if(value == 4){
    dragonConfirm({
      title: "提示",
      content: "您确定要注销当前账号？",
    }).then(() => {
      unregisterUserRef.value.open();
    })
  }
}

/**
 * 退出登陆
 * @param
 * @return
 * @author     :loulan
 * */
const logout = ()=>{
    windowsTool.localStorageTool.del(LocalStorageEnum.token);
    router.push("/login");
}
</script>

<style scoped>
.userImg {
  position: absolute;
  right: 20px;
  top:v-bind(frameHeaderHeight/5+'px');
  cursor: pointer;
}
</style>
