<template>
  <div class="headerDiv">
    <a-input v-model="queryParam.userName" style="width: 200px" placeholder="请输入用户名" allow-clear/>
    <a-input v-model="queryParam.clientCode" style="width: 200px;margin-left: 20px" placeholder="请输入客户端" allow-clear/>
    <a-select v-model="queryParam.optType" :scrollbar="false" style="width: 200px;margin-left: 20px" placeholder="请输入操作类型" allow-clear>
      <a-option v-for="(optType,index) in optTypes" :key="index" :value="optType.code">{{optType.name}}</a-option>
    </a-select>
    <a-range-picker
        show-time
        allow-clear
        v-model="queryParam.crtTimeRange"
        :time-picker-props="{ defaultValue: ['00:00:00', '09:09:06'] }"
        format="YYYY-MM-DD HH:mm"
        :placeholder="['创建开始时间','创建结束时间']"
        style="width: 350px;margin-left: 20px"
    />
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
                y:'100%'
              }"
             :scrollbar="false"
             column-resizable
             :bordered="{cell:true}"
             :loading="loading"
             @page-size-change="pageSizeChange"
             @page-change="pageChange">
      <template #content="{record}">
        <a-popover position="left" trigger="click">
          <a-button  type="outline">详细内容</a-button>
          <template #content>
            <p style="width: 450px;min-height:100px;overflow: auto" :style="{maxHeight:contentHeight-100+'px'}">{{record.content}}</p>
          </template>
        </a-popover>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>

import {onMounted, reactive, ref} from "vue";
import {ResponseResult, ResponseStatusEnum} from "../../common/domain/response";
import {TableColumnData} from "@arco-design/web-vue";
import {pageLogList} from "../../common/api/log/log";
import {getEnum, getEnums} from "../../common/tool/dragonTool";

const props = defineProps({
  contentHeight: {
    type: Number,
    required: true,
    default: 0
  }
});

// 表格数据
const tableData = ref();
// 表格列配置
const columns:Array<TableColumnData> = [
  {
    title: "客户端",
    dataIndex: "clientCode",
    width: 200
  },
  {
    title: "用户名",
    dataIndex: "userName",
    width: 200
  },
  {
    title: "操作类型",
    dataIndex: "optTypeName",
    width: 150,
  },
  {
    title: "IP",
    dataIndex: "ip",
    width: 150,
  },
  {
    title: "城市",
    dataIndex: "city"
  },
  {
    title: "创建时间",
    dataIndex: "crtTime",
    width: 200,
  },
  {
    title: "内容",
    dataIndex: "content",
    width: 120,
    slotName: "content"
  }
];
// 查询参数
const queryParam = reactive({
  optType: undefined,
  userName: undefined,
  clientCode: undefined,
  userId: undefined,
  ClientId: undefined,
  crtTimeRange: [],
  type: 31,
  pageCurrent: 1,
  pageSize: 20,
  pageTotal: 0
})

const loading = ref(true);

// 操作类型
const optTypes = ref<Array<{
  code: number,
  name: string
}>>([]);

/**
 * 分页查询数据
 * @param
 * @return
 * @author     :loulan
 * */
const pageList =async () => {
  // 查询之前进入加载状态
  loading.value = true;
  const res:ResponseResult = await pageLogList(queryParam);
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
 * 获取需要的枚举数据
 * @param
 * @return
 * @author     :loulan
 * */
const selectEnum = async ()=>{
  let data = await getEnum("org.loulan.application.dragon.common.core.enums.DgLogOptTypeExceptionEnum");
  optTypes.value = data;
}


onMounted(() => {
  selectEnum();
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
