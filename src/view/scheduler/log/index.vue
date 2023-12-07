<template>
  <div class="headerDiv">
    <a-select v-model="queryParam.executeStatus" :scrollbar="false" style="width: 200px"
              placeholder="请输入状态" allow-clear>
      <a-option :value="StatusEnum.ON">启用</a-option>
      <a-option :value="StatusEnum.OFF">禁用</a-option>
    </a-select>
    <a-button type="primary" style="margin-left: 20px" @click="search">查询</a-button>
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
                y: '100%'
              }"
             :scrollbar="false"
             column-resizable
             :bordered="{cell:true}"
             :loading="loading"
             @page-size-change="pageSizeChange"
             @page-change="pageChange">
    </a-table>
  </div>
</template>

<script lang="ts" setup>

import {onMounted, onUpdated, reactive, ref} from "vue";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {TableColumnData, TableData} from "@arco-design/web-vue";
import {AddEditEnum, StatusEnum} from "../../../common/domain/enums";
import {jobLogPageList} from "../../../common/api/scheduler/SchedulerLog";
import {core as coreTool, functionTool} from "owner-tool-js";

const props = withDefaults(defineProps<{
  contentHeight: number;
}>(),{
  contentHeight: 0
})

const infoRef = ref();
const lookLogsRef = ref();

// 表格数据
const tableData = ref();
// 表格列配置
const columns: Array<TableColumnData> = [
  {
    title: "开始时间",
    dataIndex: "startTime",
    width: 200,
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
    width: 200,
  },
  {
    title: "状态",
    dataIndex: "executeStatusName",
    width: 150,
  },
  {
    title: "结果信息",
    dataIndex: "exceptionInfo",
    ellipsis: true,
    tooltip: true
  },
];
// 查询参数
const queryParam = reactive({
  jobId: undefined,
  executeStatus: undefined,
  pageCurrent: 1,
  pageSize: 10,
  pageTotal: 0
})

const loading = ref(true);


/**
 * 分页查询数据
 * @param
 * @return
 * @author     :loulan
 * */
const pageList = async () => {
  // 查询之前进入加载状态
  loading.value = true;
  const res: ResponseResult = await jobLogPageList(queryParam);
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
const search = () => {
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


defineExpose({
  init: (jobId:any) => {
    queryParam.jobId = jobId;
    search();
  },
  close: ()=>{
    tableData.value=[];
  }
});
</script>

<style scoped>
.headerDiv {
  height: v-bind(70 + 'px');
  line-height: 70px;
}

.bodyDiv {
  /*70头部div的高度，5是多一个安全距离*/
  height: v-bind(contentHeight-75+ 'px');
}
</style>
