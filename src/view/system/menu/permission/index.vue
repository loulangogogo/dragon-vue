<template>
  <div class="headerDiv">
      <a-input-search v-model="searchKey" placeholder="请输入要进行搜索的名称" style="width: 50%" allow-clear/>
      <a-button type="primary" status="success" style="margin-left: 20px">添加</a-button>
  </div>
  <div class="bodyDiv">
    <a-table :columns="columns"
             :data="tableData"
             :stripe="true"
             :show-header="false"
             size="medium"
             page-position="bottom"
             :pagination="false"
             :scroll="{
                y:'100%'
              }"
             column-resizable
             :bordered="{cell:true}">
      <template #fieldStatus="{record}">
        <a-switch v-model="record.status" :checked-value="StatusEnum.ON" :unchecked-value="StatusEnum.OFF"/>
      </template>
      <template #operate>
        <icon-edit class="operateIcon" style="color: blue"/>
        <icon-delete class="operateIcon" style="color: red"/>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>

import {computed, reactive, ref} from "vue";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {StatusEnum,PermissionTypeEnum} from "../../../../common/domain/enums";
import {TableColumnData} from "@arco-design/web-vue";
import {getPermissionByMenuId} from "../../../../common/api/system/menu";
import * as $L from "owner-tool-js";

const props = defineProps({
  height: {
    type: Number,
    required: true,
    default: 0
  }
});
// 表格列配置
const columns: Array<TableColumnData> = [
  {
    title: "名称",
    dataIndex: "name",
    ellipsis: true,
    tooltip: true,
    width: 300,
  },
  {
    title: "组件路径",
    dataIndex: "url",
    ellipsis: true,
    tooltip: true
  },
  {
    title: "请求类型",
    dataIndex: "method",
    width: 80,
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 60,
    slotName: "fieldStatus",
  },
  {
    title: "操作",
    width: 100,
    fixed: "right",
    slotName: "operate"
  },
];
// 查询参数
const searchKey = ref();
const originTableData = ref();
const tableData = computed(() => {
  if ($L.core.isEmpty(searchKey.value)) {
    return originTableData.value;
  } else {
    return originTableData.value.filter((o:any) => o.name.includes(searchKey.value));
  }
})
// 记录传输过来的菜单id
const menuId = ref();


/**
 * 点击查询按钮的时候
 * @param
 * @return
 * @author     :loulan
 * */
const query = async () => {
  const res: ResponseResult = await getPermissionByMenuId(menuId.value,PermissionTypeEnum.URL);
  if (res.status === ResponseStatusEnum.OK) {
    const datas: Array<any> = res.data;
    if ($L.core.isNotEmpty(datas)) {
      originTableData.value = datas;
    } else {
      originTableData.value = [];
    }
  }
}

defineExpose({
  init: (paramMenuId: number) => {
    menuId.value = paramMenuId;
    query();
  }
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
