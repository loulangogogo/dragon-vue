<template>
  <div class="headerDiv">
    <a-input v-model="queryParam.name" style="width: 200px" placeholder="请输入名称" allow-clear/>
    <a-input v-model="queryParam.target" style="width: 200px;margin-left: 20px" placeholder="请输入执行目标"
             allow-clear/>
    <a-select v-model="queryParam.status" :scrollbar="false" style="width: 200px;margin-left: 20px"
              placeholder="请输入状态" allow-clear>
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
                y: '100%'
              }"
             :scrollbar="false"
             column-resizable
             :bordered="{cell:true}"
             :loading="loading"
             @page-size-change="pageSizeChange"
             @page-change="pageChange">
      <template #statusSlot="{record}">
        <a-switch v-model="record.status" :checked-value="StatusEnum.ON" :unchecked-value="StatusEnum.OFF"
                  checked-color="green" unchecked-color="red" :before-change="()=>jobStatusChange(record)">
        </a-switch>
      </template>
      <template #operate="{record}">
        <a-button type="primary" size="mini" status="success" @click="lookLogs(record)">日志</a-button>
        <a-button type="primary" size="mini" @click="edit(record)" style="margin-left: 10px">编辑</a-button>
        <a-button type="primary" status="danger" size="mini" style="margin-left: 10px" @click="del(record)">删除
        </a-button>
      </template>
    </a-table>
  </div>
  <div v-show="false">
    <info ref="infoRef" @query="search"></info>
    <look-log ref="lookLogsRef"></look-log>
  </div>
</template>

<script lang="ts" setup>

import Info from './info.vue';
import LookLog from "./look-log.vue";
import {onMounted, reactive, ref} from "vue";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {TableColumnData, TableData} from "@arco-design/web-vue";
import {dragonConfirm, DragonMessage, DragonNotice} from "../../../common/domain/component";
import {StatusEnum} from "../../../common/domain/enums";
import {jobChangeStatus, jobDel, jobPageList} from "../../../common/api/scheduler/schedulerJob";

const props = defineProps({
  contentHeight: {
    type: Number,
    required: true,
    default: 0
  }
});

const infoRef = ref();
const lookLogsRef = ref();

// 表格数据
const tableData = ref();
// 表格列配置
const columns: Array<TableColumnData> = [
  {
    title: "名称",
    dataIndex: "name",
    width: 150,
    ellipsis: true,
    tooltip: true,
    fixed: "left",
  },
  {
    title: "所属应用",
    dataIndex: "applicationName",
    width: 150,
  },
  {
    title: "执行目标",
    dataIndex: "target",
    width: 200,
    ellipsis: true,
    tooltip: true
  },
  {
    title: "cron",
    dataIndex: "cron",
    width: 150,
  },
  {
    title: "模式",
    dataIndex: "modeName",
    width: 150,
  },
  {
    title: "并行",
    dataIndex: "isConcurrent",
    width: 70,
    render: (data: {
      record: TableData;
      column: TableColumnData;
      rowIndex: number;
    }) => {
      return data.record?.isConcurrent ? "是" : "否";
    },
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 70,
    slotName: "statusSlot"
  },
  {
    title: "运行时间(秒)",
    dataIndex: "runTime",
    width: 120,
  },
  {
    title: "创建时间",
    dataIndex: "crtTime",
    width: 200,
  },
  {
    title: "操作",
    width: 200,
    fixed: "right",
    slotName: "operate"
  },
];
// 查询参数
const queryParam = reactive({
  name: undefined,
  target: undefined,
  status: undefined,
  pageCurrent: 1,
  pageSize: 10,
  pageTotal: 0
})

const loading = ref(true);

/**
 * 查看定时任务的运行日志
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const lookLogs = (data:any)=>{
  lookLogsRef.value.init(data);
}

/**
 * 任务状态发生改变
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const jobStatusChange = async (record: any) => {
  // id
  const id = record.id;
  // 原来的状态
  const status = record.status;
  // 修改状态
  const changeStatus = StatusEnum.ON == status ? StatusEnum.OFF : StatusEnum.ON;

  return  dragonConfirm({
    title: '确认提示',
    content: '您确认' + (StatusEnum.ON == changeStatus ? "启用" : "禁用") + '这个任务吗？'
  }).then(async ()=>{
      const res: ResponseResult = await jobChangeStatus(id, changeStatus);
      if (res.status === ResponseStatusEnum.OK) {
        // DragonNotice.success("删除成功");
          return true;
      } else {
          return false;
      }
  })
}

/**
 * 分页查询数据
 * @param
 * @return
 * @author     :loulan
 * */
const pageList = async () => {
  // 查询之前进入加载状态
  loading.value = true;
  const res: ResponseResult = await jobPageList(queryParam);
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

/**
 * 添加操作
 * @param
 * @return
 * @author     :loulan
 * */
const add = () => {
  infoRef.value.init();
}

/**
 * 用户的编辑
 * @param
 * @return
 * @author     :loulan
 * */
const edit = (data: any) => {
  // 进行编辑的时候要先禁用数据状态
  if (StatusEnum.ON == data.status) {
    DragonMessage.warning("请先禁用当前定时任务");
  } else {
    infoRef.value.init(data);
  }
}

const del = (data: any) => {
  dragonConfirm({
    title: '确认提示',
    content: '您确认删除这条数据吗？'
  }).then(async () => {
    const res: ResponseResult = await jobDel(data.id);
    if (res.status === ResponseStatusEnum.OK) {
      search();
      DragonNotice.success("删除成功");
    }
  })
}


onMounted(() => {
  pageList();
})
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
