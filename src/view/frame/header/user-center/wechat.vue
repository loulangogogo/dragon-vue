<template>
  <!--展示的卡片-->
  <a-card hoverable class="card">
    <template #extra>
      <a-button type="outline" @click="dealWechat">{{isBinding?'解绑':'绑定'}}微信</a-button>
    </template>
    <icon-wechat :style="{color: isBinding?'blue':''}"
                 style="width: 50%;height: 50%;max-width: 150px;min-width: 50px;position: relative;top: 30px"/>
  </a-card>

  <!--绑定和解绑微信-->
  <a-modal v-model:visible="modalVisible"
           :title="'扫码绑'+(isBinding?'解绑':'绑定')+'微信'"
           title-align="start"
           width="350px"
           :mask-closable="false"
           :hide-cancel="true"
           ok-text="关闭"
           layout="horizontal"
           :auto-label-width="true"
           @close="close">
    <div align="center" style="position: static">
      <a-spin :loading="loading" tip="加载中……">
        <qrcode-vue :value="qrcode.url"
                    :size="200"
                    background="rgba(0,0,0,0)"/>
      </a-spin>
    </div>
  </a-modal>
</template>

<script setup lang="ts">

import {ref, reactive, computed, onMounted} from "vue";
import QrcodeVue from 'qrcode.vue';
import {getWechatQrcode} from "../../../../common/api/login";
import {Qrcode} from "../../../../common/domain/interfaces";
import {core as coreTool, functionTool} from "owner-tool-js";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {WechatQrcodeTypeEnum} from "../../../../common/domain/enums";
import {UserInfo} from "../../../../common/domain/common";
import {
  currentUserBindingWechat,
  currentUserUnbindingWechat
} from "../../../../common/api/system/user";
import {DragonNotice} from "../../../../common/domain/component";

// 绑定修改数据之后需要重新获取当前用户信息，修改存在store中的当前用户信息
const emits = defineEmits(["reset-user-info"]);
// 用户信息
const {userInfo} = defineProps<{
  userInfo: UserInfo
}>();

// 是否已经绑定微信
const isBinding = computed(() => coreTool.isNotEmpty(userInfo.unionid));

// 弹框显示
const modalVisible = ref(false);

// 二维码的加载状态
const loading = ref(false);

// 登录需要的信息
const bingdingWechatData = reactive({
  ticket: ""
});

// 微信二维码对象数据
let qrcode = reactive<Qrcode>({});

// 定时请求token的对象
let setIntervalObj: number;

/**
 * 点击处理微信
 * @param
 * @return
 * @author     :loulan
 * */
const dealWechat = () => {
  loading.value = true;
  getQrcode();
  modalVisible.value = true;
}

/**
 * 获取微信二维码
 * @param
 * @return
 * @author     :loulan
 * */
const getQrcode = async () => {
  // 如果定时器存在就先关闭定时器
  if (coreTool.isExist(setIntervalObj)) clearInterval(setIntervalObj);
  // 请求微信二维码
  const res: ResponseResult = await getWechatQrcode(WechatQrcodeTypeEnum.BINDING_USER);
  if (res.status === ResponseStatusEnum.OK) {
    functionTool.combineObj(qrcode, res.data);
    loading.value = false;
    bingdingWechatData.ticket = <string>qrcode.ticket;
    // 成功请求到数据之后，进入定时器进行定时token的请求
    setIntervalObj = setInterval(() => {
      if (isBinding.value) {
        // 如果已经绑定微信，那么这里就是解除绑定
        currentUserUnbindingWechat(bingdingWechatData.ticket).then((res:ResponseResult) => {
          if (res.status === ResponseStatusEnum.OK) {
            if (coreTool.isExist(setIntervalObj)) clearInterval(setIntervalObj);
            modalVisible.value = false;
            emits("reset-user-info");
            DragonNotice.success("微信解绑成功");
          }
        })
      } else {
        // 如果没有绑定卫星，那么这里就是绑定微信
        currentUserBindingWechat(bingdingWechatData.ticket).then((res:ResponseResult) => {
          if (res.status === ResponseStatusEnum.OK) {
            if (coreTool.isExist(setIntervalObj)) clearInterval(setIntervalObj);
            modalVisible.value = false;
            emits("reset-user-info");
            DragonNotice.success("微信绑定成功");
          }
        })
      }
    }, 2500);
  } else {
    qrcode.url = "当前二维码错误，请重新操作。";
    qrcode.ticket = undefined;
    qrcode.expire_seconds = undefined;
  }
}

/**
 * 点击关闭事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {
// 如果定时器存在就先关闭定时器
  if (coreTool.isExist(setIntervalObj)) clearInterval(setIntervalObj);

  qrcode.url = "当前二维码不存在。";
  qrcode.ticket = undefined;
  qrcode.expire_seconds = undefined;
}
</script>

<style scoped>
/*卡片样式*/
.card {
  height: 100%;
  overflow: hidden;
  text-align: center;
}
</style>
