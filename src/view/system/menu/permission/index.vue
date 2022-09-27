<template>
  <div class="headerDiv">
    <a-input v-model="queryParam.username" style="width: 200px" placeholder="请输入用户名" allow-clear/>
    <a-input v-model="queryParam.name" style="width: 200px;margin-left: 20px" placeholder="请输入姓名" allow-clear/>
    <a-input v-model="queryParam.phone" style="width: 200px;margin-left: 20px" placeholder="请输入手机号码" allow-clear/>
    <a-button type="primary" style="margin-left: 20px" @click="search">查询</a-button>
    <a-button type="primary" status="success" style="margin-left: 20px" @click="search">添加</a-button>
  </div>
  <div class="bodyDiv">
    <a-table :columns="columns"
             :data="tableData"
             :stripe="true"
             :show-header="false"
             size="medium"
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
      <template #operate>
        <icon-edit class="operateIcon" style="color: blue"/>
        <icon-delete class="operateIcon" style="color: red"/>
        <!--<a-button type="primary" size="mini" >编辑</a-button>-->
        <!--<a-button type="primary" status="danger" size="mini" style="margin-left: 10px">删除</a-button>-->
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>

import {onMounted, reactive, ref} from "vue";
import {pageUserList} from "../../../../common/api/system/user";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {TableColumnData} from "@arco-design/web-vue";

const props = defineProps({
  height: {
    type: Number,
    required: true,
    default: 0
  }
});

// 表格数据
const tableData = ref([
  {
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },{
    name: "测试",
    code: "user-manager",
    path: "view/user/index.vue",
    method: "post"
  },
]);
// 表格列配置
const columns:Array<TableColumnData> = [
  {
    title: "名称",
    dataIndex: "name",
    tooltip: true,
    width: 150,
  },
  {
    title: "编码(URL)",
    dataIndex: "code",
    tooltip: true,
    width: 150,
  },
  {
    title: "组件路径",
    dataIndex: "path",
    tooltip: true
  },
  {
    title: "请求类型",
    dataIndex: "method",
    width: 100,
  },
  {
    title: "操作",
    width: 100,
    fixed: "right",
    slotName: "operate"
  },
];
// 查询参数
const queryParam = reactive({
  username: undefined,
  name: undefined,
  phone: undefined,
  pageCurrent: 1,
  pageSize: 10,
  pageTotal: 30
})

const loading = ref(true);

/**
 * 分页查询数据
 * @param
 * @return
 * @author     :loulan
 * */
const pageList = () => {
  // 查询之前进入加载状态
  loading.value = true;
  pageUserList(queryParam).then((res:ResponseResult) => {
    if (res.status === ResponseStatusEnum.OK) {
      const data = res.data;
      // tableData.value = data.records;
      // queryParam.pageTotal = data.total;
    }
    // 查询无论成功与否退出加载状态
    loading.value = false;
  })
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


onMounted(() => {
  pageList();
})
</script>

<style scoped>
.headerDiv {
  height: v-bind(50 + 'px');
  line-height: 50px;
  padding: 0 2px;
}

.bodyDiv {
  /*70头部div的高度，5是多一个安全距离*/
  height: v-bind(height-55+ 'px');
}


.operateIcon {
  margin-left: 10px;
  font-size: 20px;
}

.operateIcon:hover {
  cursor: pointer;
}
</style>
