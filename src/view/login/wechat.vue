<template>
  <div align="center" style="position: static">
    <qrcode-vue :value="qrcode.url"
                :size="200"
                background="rgba(0,0,0,0)"
    ></qrcode-vue>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, reactive, ref} from "vue";
//https://gitcode.net/mirrors/scopewu/qrcode.vue?utm_source=csdn_github_accelerator
import QrcodeVue from 'qrcode.vue';
import {getWechatQrcode} from "../../common/api/login";
import {ResponseResult, ResponseStatusEnum} from "../../common/domain/response";
import {functionTool,core as coreTool} from "owner-tool-js";
import {LoginModeEnum} from "../../common/domain/login";
import {GrantTypeEnum} from "../../common/domain/enums";

// 事件对象
const emit = defineEmits(['loginSubmit']);

// 登录需要的信息
const loginData = reactive({
  ticket: "",
  grant_type: GrantTypeEnum.WECHAT_SCAN
});

interface Qrcode{
  ticket?: string,
  url?: string,
  expire_seconds?: number
}

// 微信二维码对象数据
let qrcode = reactive<Qrcode>({});

// 定时请求token的对象
let setIntervalObj:number;

/**
 * 获取微信登陆二维码
 * @param
 * @return
 * @author     :loulan
 * */
const getQrcode = async ()=>{
  // 如果定时器存在就先关闭定时器
  if (coreTool.isExist(setIntervalObj)) clearInterval(setIntervalObj);
  // 请求微信二维码
  const res:ResponseResult = await getWechatQrcode();
  if (res.status === ResponseStatusEnum.OK) {
    functionTool.combineObj(qrcode,res.data)

    loginData.ticket = <string>qrcode.ticket;
    // 成功请求到数据之后，进入定时器进行定时token的请求
    setIntervalObj = setInterval(() => {
      // 如果对象对象请求成功就会跳转无须专门关闭定时器
      emit("loginSubmit", loginData);
    }, 2500);
  }
}

onMounted(()=>{
  getQrcode();
})

onUnmounted(()=>{
  // 如果定时器存在就先关闭定时器
  if (coreTool.isExist(setIntervalObj)) clearInterval(setIntervalObj);
})
</script>

<style scoped>

</style>
