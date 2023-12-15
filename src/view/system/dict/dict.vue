<template>
  <div class="headerDiv">
    <a-input v-model="queryParam.name" style="width: 200px" placeholder="请输入名称" allow-clear/>
    <a-select v-model="queryParam.status" :scrollbar="false" style="width: 200px;margin-left: 20px" placeholder="请输入状态" allow-clear>
      <a-option :value="StatusEnum.ON">启用</a-option>
      <a-option :value="StatusEnum.OFF">禁用</a-option>
    </a-select>
    <a-button type="primary" style="margin-left: 20px" @click="search">查询</a-button>
    <a-button type="primary" status="success" style="margin-left: 20px" @click="add">添加</a-button>
  </div>
  <div class="bodyDiv">
    <a-table :columns="columns"
             :data="tableData"
             :stripe="true"
             page-position="bottom"
             :pagination="{
                total: queryParam.pageTotal,
                showTotal: true,
                showJumper: true,
                showPageSize: true,
                pageSizeOptions:[10,20,30,40,50],
                current:queryParam.pageCurrent,
                pageSize: queryParam.pageSize,
              }"
             :scroll="{
                y:'100%'
              }"
             :scrollbar="false"
             column-resizable
             :bordered="{cell:true}"
             :loading="loading"
             @page-size-change="pageSizeChange"
             @page-change="pageChange">
      <template #operate="{record}">
        <a-button type="primary" size="mini" @click="edit(record)">编辑</a-button>
        <a-button type="primary" status="danger" size="mini" style="margin-left: 10px" @click="del(record)">删除</a-button>
      </template>
    </a-table>
  </div>
  <div v-show="false">
    <info ref="infoRef" @query="search" :type="queryParam.type"></info>
  </div>
</template>

<script lang="ts" setup>

import Info from './dict-info.vue';
import {onMounted, reactive, ref} from "vue";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {TableColumnData} from "@arco-design/web-vue";
import {dragonConfirm, DragonNotice} from "../../../common/domain/component";
import {dictDel, pageDictList} from "../../../common/api/system/dict";
import {AddEditEnum, StatusEnum} from "../../../common/domain/enums";
import {core as coreTool, functionTool} from "owner-tool-js";

const props = defineProps({
  contentHeight: {
    type: Number,
    required: true,
    default: 0
  }
});

const infoRef = ref();

// 表格数据
const tableData = ref();
// 表格列配置
const columns:Array<TableColumnData> = [
  {
    title: "字典名称",
    dataIndex: "name",
    width: 150,
    fixed: "left",
  },
  {
    title: "字典编码",
    dataIndex: "code",
    width: 300,
  },
  {
    title: "排序",
    dataIndex: "orderNum",
    width: 300,
  },
  {
    title: "状态",
    dataIndex: "statusName",
    width: 100,
  },
  {
    title: "操作",
    width: 150,
    fixed: "right",
    slotName: "operate"
  },
];
// 查询参数
const queryParam = reactive({
  type: undefined,
  name: undefined,
  status: undefined,
  pageCurrent: 1,
  pageSize: 10,
  pageTotal: 0
})

const loading = ref(false);

/**
 * 分页查询数据
 * @param
 * @return
 * @author     :loulan
 * */
const pageList =async () => {
  // 查询之前进入加载状态
  loading.value = true;
  const res:ResponseResult = await pageDictList(queryParam);
  if (res.status === ResponseStatusEnum.OK) {
    const data = res.data;
    tableData.value = data.records;
    queryParam.pageTotal = data.total;
  }
  // 查询无论成功与否退出加载状态
  loading.value = false;
}

/**
 * 点击查询按钮的时候
 * @param
 * @return
 * @author     :loulan
 * */
const search = ()=>{
  queryParam.pageCurrent = 1;
  pageList();
}

/**
 * 当页码发生变化的时候
 * @param
 * @return
 * @author     :loulan
 * */
const pageChange = (pageCurrent: number) => {
  queryParam.pageCurrent = pageCurrent;
  pageList();
}

/**
 * 当每页的数目发生变化的时候
 * @param
 * @return
 * @author     :loulan
 * */
const pageSizeChange = (pageSize: number) => {
  queryParam.pageSize = pageSize;
  pageList();
}

/**
 * 添加操作
 * @param
 * @return
 * @author     :loulan
 * */
const add = ()=>{
  infoRef.value.init();
}

/**
 * 用户的编辑
 * @param
 * @return
 * @author     :loulan
 * */
const edit = (data:any) => {
  infoRef.value.init(data);
}

const del = (data:any) => {
  dragonConfirm({
    title: '确认提示',
    content: '您确认删除这条数据吗？'
  }).then(async ()=>{
    const res:ResponseResult = await dictDel(data.id);
    if (res.status === ResponseStatusEnum.OK) {
      search();
      DragonNotice.success("删除成功");
    }
  })
}


defineExpose({
  queryByType: (data:any) => {
    queryParam.type=data.code;
    pageList();
  }
});
</script>

<style scoped>
.headerDiv {
  height: v-bind(70 + 'px');
  line-height: 70px;
  padding: 0 5px;
}

.bodyDiv {
  /*70头部div的高度，5是多一个安全距离*/
  height: v-bind(contentHeight-75+ 'px');
}
</style>
