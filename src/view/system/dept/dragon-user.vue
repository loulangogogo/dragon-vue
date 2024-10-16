<script setup lang="ts">

import userComponent from "../user/index.vue";
import {inject, provide, ref} from "vue";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {pageUserList} from "../../../common/api/system/user";
import {core as coreTool} from "owner-tool-js";
import {TableColumnData, TableData} from "@arco-design/web-vue";

const props = withDefaults(defineProps<{
  contentHeight: number;
}>(),{
  contentHeight: 0,
})

// 当前部门id
const currentDeptId = ref();
// 用户组件的ref
const userComponentRef = ref();

// 分页查询用户
const pageUsers = inject("pageUserList", async (param: any): Promise<ResponseResult> => {
  const res: ResponseResult = await pageUserList(param);
  return res;
});

defineExpose({
  /**
   * 根据部门查询
   * @param
   * @return
   * @exception
   * @author     :loulan
   * */
  searchByDept: (deptId: any) => {
    currentDeptId.value = deptId;
    userComponentRef.value.reset();
    userComponentRef.value.initSearch();
  },
});

// 向外提供查询方法
provide("pageUserList", async (param: any): Promise<ResponseResult> => {
  param.deptId = currentDeptId.value;
  if (coreTool.isNotExist(param.deptId)) {
    return <ResponseResult>{
      data: [],
      msg: "部门id未设置",
      status: ResponseStatusEnum.FAIT,
      taskId: ""
    }
  }
  return await pageUsers(param);
});
provide("userIsVisibleAddButton", false);
provide("userIsVisibleRoleManagerButton", false);
provide("userIsVisibleDelButton", false);

// 用户的table列表展示内容
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
    width: 150,
  },
  {
    title: "手机号码",
    dataIndex: "phone",
    width: 160,
    slotName: 'phoneSlot'
  },
  {
    title: "岗位角色",
    dataIndex: "roleName",
    width: 100,
    ellipsis: true,
    tooltip: true,
    render: (data: { record: TableData, column: TableColumnData, rowIndex: number }) => {
      if (coreTool.isEmpty(data.record?.roles)) {
        return "";
      } else {
        return data.record.roles.map((o: any) => o.name).join(",");
      }
    },
  },
  {
    title: "状态",
    dataIndex: "statusName",
    width: 70,
  },
  {
    title: "注册时间",
    dataIndex: "crtTime",
    width: 180,
  },
  {
    title: "操作",
    width: 130,
    fixed: "right",
    slotName: "operate"
  },
])
</script>

<template>
  <user-component ref="userComponentRef" :content-height="contentHeight"/>
</template>

<style scoped>

</style>