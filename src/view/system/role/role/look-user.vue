<template>
  <a-modal v-model:visible="modalVisible"
           title="角色用户"
           title-align="start"
           width="950px"
           :mask-closable="false"
           :footer="false"
           @close="close">
    <dragon-user ref="dragonUserRef" :content-height="600"></dragon-user>
  </a-modal>
</template>

<script lang="ts" setup>
import DragonUser from '../../user/index.vue';
import {inject, provide, ref} from "vue";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {pageUserList} from "../../../../common/api/system/user";
import {core as coreTool} from "owner-tool-js";

// 模态框的显示状态
const modalVisible = ref(false);
const dragonUserRef = ref();

const roleData = ref();


/**
 * 分页查询用户数据
 * @param
 * @return
 * @author     :loulan
 * */
const pageUsers = async (param:any):Promise<ResponseResult> => {
  param.roleId = roleData.value?.id;
  if (coreTool.isNotExist(param.roleId)) {
    return <ResponseResult>{
      data: [],
      msg: "角色id未设置",
      status: ResponseStatusEnum.FAIT,
      taskId: ""
    }
  }
  const res: ResponseResult = await pageUserList(param);
  return res;
}

/**
 * 对话框关闭触发的事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {
  roleData.value = undefined;
  dragonUserRef.value.reset();
}

defineExpose({
  init: (data: any) => {
    roleData.value = data;
    dragonUserRef.value.reset();
    dragonUserRef.value.initSearch();
    modalVisible.value = true;
  }
});


provide("pageUserList", inject("pageUserList",pageUsers));
provide("userIsVisibleAddButton", false);
provide("userColumns",[
  {
    title: "姓名/昵称",
    dataIndex: "name",
    width: 150,
    fixed: "left",
  },
  {
    title: "用户名",
    dataIndex: "username",
    width: 200,
  },
  {
    title: "手机号码",
    dataIndex: "phone",
    width: 160,
    slotName: 'phoneSlot'
  },
  {
    title: "状态",
    dataIndex: "statusName",
    width: 70,
  },
  {
    title: "操作",
    width: 130,
    fixed: "right",
    slotName: "operate"
  },
])
</script>

<style scoped>

</style>
