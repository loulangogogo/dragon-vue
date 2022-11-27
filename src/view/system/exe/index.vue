<template>
  <div class="headerDiv">
    <a-input v-model="queryParam.code" style="width: 200px" placeholder="请输入用编码" allow-clear/>
    <a-input v-model="queryParam.name" style="width: 200px" placeholder="请输入名称" allow-clear/>
    <a-select v-model="queryParam.status" style="width: 200px;margin-left: 20px" placeholder="请选择状态" allow-clear>
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
    <info ref="infoRef" @query="search"></info>
  </div>
</template>

<script lang="ts" setup>

import Info from './info.vue';
import {onMounted, reactive, ref} from "vue";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {GrantTypeEnum,StatusEnum} from "../../../common/domain/enums";
import {TableColumnData} from "@arco-design/web-vue";
import {dragonConfirm, DragonNotice} from "../../../common/domain/component";
import {clientDel, pageClientList} from "../../../common/api/system/client";
import {exeDel, pageExeList} from "../../../common/api/system/exe";

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
    title: "编码",
    dataIndex: "code",
    width: 300,
    fixed: "left",
  },
  {
    title: "名称",
    dataIndex: "name",
  },
  {
    title: "类型",
    dataIndex: "typeName",
    width: 200,
  },
  {
    title: "状态",
    dataIndex: "statusName",
    width: 80,
  },
  {
    title: "创建时间",
    dataIndex: "crtTime",
    width: 200,
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
  code: undefined,
  status: undefined,
  name: undefined,
  type: undefined,
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
const pageList =async () => {
  // 查询之前进入加载状态
  loading.value = true;
  const res:ResponseResult = await pageExeList(queryParam);
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

/**
 * 点击删除
 * @param
 * @return
 * @author     :loulan
 * */
const del = (data:any) => {
  dragonConfirm({
    title: '确认提示',
    content: '您确认删除这条数据吗？'
  }).then(async ()=>{
    const res:ResponseResult = await exeDel(data.id);
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
