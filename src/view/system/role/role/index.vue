<template>
  <div class="headerDiv">
    <a-input v-model="queryParam.name" style="width: 200px" placeholder="请输入名称" allow-clear/>
    <a-button type="primary" style="margin-left: 20px" @click="search">查询</a-button>
    <a-button type="primary" status="success" style="margin-left: 20px" @click="search">添加</a-button>
  </div>
  <div class="bodyDiv">
    <a-table :columns="columns"
             :data="tableData"
             :stripe="true"
             :pagination="false"
             :scroll="{
                y:'100%'
              }"
             column-resizable
             :bordered="{cell:true}"
             :loading="loading">
      <template #operate>
        <a-space>
          <a-button type="primary" status="warning" size="mini">权限编辑</a-button>
          <a-button type="primary" size="mini" >编辑</a-button>
          <a-button type="primary" status="danger" size="mini">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>

import {onMounted, reactive, ref} from "vue";
import {pageUserList} from "../../../../common/api/system/user";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {TableColumnData} from "@arco-design/web-vue";
import {getRoleByType} from "../../../../common/api/role";

const props = defineProps({
  height: {
    type: Number,
    required: true,
    default: 0
  },
  roleTypeId: {
    type: Number,
    required: true,
    default: undefined
  }
});

// 表格数据
const tableData = ref();
// 表格列配置
const columns:Array<TableColumnData> = [
  {
    title: "名称",
    dataIndex: "name",
    width: 300,
    fixed: "left",
  },
  {
    title: "备注",
    dataIndex: "nt",
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 150,
  },
  {
    title: "操作",
    width: 250,
    fixed: "right",
    slotName: "operate"
  },
];
// 查询参数
const queryParam = reactive({
  name: undefined,
})

const loading = ref(true);

/**
 * 分页查询数据
 * @param
 * @return
 * @author     :loulan
 * */
const queryRole = async () => {
  // 查询之前进入加载状态
  loading.value = true;
  const res: ResponseResult = await getRoleByType(<number>props.roleTypeId);
  if (res.status === ResponseStatusEnum.OK) {
    tableData.value = res.data;
  }

  loading.value = false;
}

/**
 * 点击查询按钮的时候
 * @param
 * @return
 * @author     :loulan
 * */
const search = ()=>{
  queryRole();
}


onMounted(() => {
  queryRole();
})
</script>

<style scoped>
.headerDiv {
  height: v-bind(50 + 'px');
  line-height: 50px;
  padding: 0 5px;
}

.bodyDiv {
  /*70头部div的高度，5是多一个安全距离*/
  height: v-bind(height-55+ 'px');
}
</style>
