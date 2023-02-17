<template>
  <div class="headerDiv">
    <a-input-search v-model="searchKey" placeholder="请输入要进行搜索的名称" style="width: 50%" allow-clear/>
    <a-button v-if="!isRolePermission" type="primary" status="success" style="margin-left: 20px" @click="add">添加</a-button>
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
             :scrollbar="false"
             column-resizable
             row-key="id"
             :row-selection="isRolePermission?{
               type: 'checkbox',
               fixed: true,
               width: 50
             }:undefined"
             :selected-keys="selectedKeys"
             @update:selected-keys="(val:Array<string|number>) => $emit('update:selectedKeys', val)"
             :bordered="{cell:true}">
      <template #fieldStatus="{record}">
        <a-switch v-model="record.status" :checked-value="StatusEnum.ON" :unchecked-value="StatusEnum.OFF" @change="(val:any)=>statusChange(val,record)"/>
      </template>
      <template #operate="{record}">
        <icon-edit class="operateIcon" style="color: blue" @click="edit(record)"/>
        <icon-delete class="operateIcon" style="color: red" @click="del(record)"/>
      </template>
    </a-table>
  </div>
  <div v-show="false">
    <Info ref="infoRef" @query-permission="query" :menu-id="menuId"></Info>
  </div>
</template>

<script lang="ts" setup>
import Info from './info.vue';
import {computed, reactive, ref, watch} from "vue";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {StatusEnum, PermissionTypeEnum} from "../../../../common/domain/enums";
import {TableColumnData} from "@arco-design/web-vue";
import {getPermissionByMenuId, permissionDel,permissionUpdate} from "../../../../common/api/system/menu";
import * as $L from "owner-tool-js";
import {dragonConfirm, DragonMessage, DragonNotice} from "../../../../common/domain/component";

const props = defineProps({
  height: {
    type: Number,
    required: true,
    default: 0
  },
  isRolePermission: {
    type: Boolean,
    required: false,
    default: false
  },
  selectedKeys:{
    type: [Array<string|number>],
    required: false,
    default: []
  }
});

const infoRef = ref();

// 表格列配置(授权展示和菜单展示不一样)
const columns: Array<TableColumnData> = props.isRolePermission?[
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
    width: 100,
  }
]:[
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
    width: 100,
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 70,
    slotName: "fieldStatus",
  },
  {
    title: "操作",
    width: 120,
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
    return originTableData.value.filter((o: any) => o.name.includes(searchKey.value));
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
  const res: ResponseResult = await getPermissionByMenuId(menuId.value, PermissionTypeEnum.URL);
  if (res.status === ResponseStatusEnum.OK) {
    const datas: Array<any> = res.data;
    if ($L.core.isNotEmpty(datas)) {
      originTableData.value = datas;
    } else {
      originTableData.value = [];
    }
  }
}

/**
 * 当状态发生切换的时候
 * @param
 * @return
 * @author     :loulan
 * */
const statusChange = async (val:number,data:any) => {
  const res: ResponseResult = await permissionUpdate({
    id: data.id,
    status: val
  });
}

/**
 * 点击添加按钮的时候
 * @param
 * @return
 * @author     :loulan
 * */
const add = () => {
  infoRef.value.init();
}

/**
 * 点击编辑按钮的时候
 * @param     nodeData 节点数据
 * @return
 * @author     :loulan
 * */
const edit = (data: any) => {
  infoRef.value.init(data);
}

/**
 * 点击删除按钮的时候
 * @param
 * @return
 * @author     :loulan
 * */
const del = (data: any) => {
  dragonConfirm({
    title: '确认提示',
    content: '您确认删除这条数据吗？'
  }).then(async ()=>{
    const res:ResponseResult = await permissionDel(data.id);
    if (res.status === ResponseStatusEnum.OK) {
      query();
      DragonNotice.success("删除成功");
    }
  })
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
