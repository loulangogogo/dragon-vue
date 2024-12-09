<template>
  <div class="headerDiv">
    <a-select v-model="queryParam.generateStatus" :scrollbar="false" style="width: 200px;margin-left: 20px" placeholder="请选择生成状态" allow-clear>
      <a-option :value="FileGenerateStatusEnum.WAIT">排队中</a-option>
      <a-option :value="FileGenerateStatusEnum.ING">生成中</a-option>
      <a-option :value="FileGenerateStatusEnum.SUCCESS">已生成</a-option>
      <a-option :value="FileGenerateStatusEnum.FAIL">生成失败</a-option>
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
                y:'100%'
              }"
             :scrollbar="false"
             column-resizable
             :bordered="{cell:true}"
             :loading="loading"
             @page-size-change="pageSizeChange"
             @page-change="pageChange">
      <template #operate="{record}">
        <a-button type="primary" size="mini" @click="downloadFile(record)">点击下载</a-button>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {FileGenerateStatusEnum, StatusEnum} from "../../../common/domain/enums";
import {TableColumnData} from "@arco-design/web-vue";
import {generateFilePageList} from "../../../common/api/system/generateFile";
import {core as coreTool} from "owner-tool-js";
import {DragonMessage} from "../../../common/domain/component";
import {downloadByUrl, download, multipartDownload} from "../../../common/tool/fileTool";

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
    title: "名称",
    dataIndex: "name",
    width: 210,
    ellipsis: true,
    tooltip: true,
    fixed: "left"
  },
  {
    title: "大小",
    dataIndex: "size",
    width: 150,
  },
  {
    title: "所属类型",
    dataIndex: "dataTypeName",
    width: 150,
  },
  {
    title: "状态",
    dataIndex: "generateStatusName",
    width: 180,
  },
  {
    title: "所属站点",
    dataIndex: "stationName",
    width: 150,
  },
  {
    title: "所属用户",
    dataIndex: "userName",
    width: 150,
  },
  {
    title: "下载次数",
    dataIndex: "downloadCount",
    width: 100,
  },
  {
    title: "申请时间",
    dataIndex: "startTime",
    width: 200,
  },
  {
    title: "生成时间",
    dataIndex: "endTime",
    width: 200,
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
  generateStatus: undefined,
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
  const res:ResponseResult = await generateFilePageList(queryParam);
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
 * 生成文件的下载
 * @param
 * @return
 * @author     :loulan
 * */
const downloadFile = async (data:any) => {
  if (data?.generateStatus != FileGenerateStatusEnum.SUCCESS) {
    DragonMessage.error("文件未生成！");
    return;
  }

  if (coreTool.isNotExist(data.path)) {
    DragonMessage.error("文件路径错误！");
    return;
  }

  const isPublic:boolean = data.isPublic;
  if (isPublic) {
    downloadByUrl(data.url, data.name);
  } else {
    download(data.path).then((url:any)=>{
      downloadByUrl(url, data.name);
    })
  }
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
