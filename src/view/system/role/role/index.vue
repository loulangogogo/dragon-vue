<template>
  <div class="headerDiv">
    <a-input v-model="queryParam.name" style="width: 200px" placeholder="请输入名称" allow-clear/>
    <a-button type="primary" style="margin-left: 20px" @click="search">查询</a-button>
    <a-button type="primary" status="success" style="margin-left: 20px" @click="add">添加</a-button>
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
      <template #fieldStatus="{record}">
        <a-switch v-model="record.status" :checked-value="StatusEnum.ON" :unchecked-value="StatusEnum.OFF" @change="(val:any)=>statusChange(val,record)"/>
      </template>
      <template #operate="{record}">
        <a-space>
          <a-button type="primary" status="warning" size="mini">权限编辑</a-button>
          <a-button type="primary" size="mini" @click="edit(record)">编辑</a-button>
          <a-button type="primary" status="danger" size="mini" @click="del(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
  <div v-show="false">
    <Info ref="infoRef" :role-type-id="roleTypeId" @query-role="queryRole"></Info>
  </div>
</template>

<script lang="ts" setup>
import Info from './info.vue';
import {onMounted, reactive, ref} from "vue";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {TableColumnData} from "@arco-design/web-vue";
import {getRoleByType, roleDel, roleUpdate} from "../../../../common/api/system/role";
import {StatusEnum} from "../../../../common/domain/enums";
import {dragonConfirm, DragonNotice} from "../../../../common/domain/component";

const props = defineProps<{
  height:number,
  roleTypeId:number
}>();

// 添加编辑组件的ref
const infoRef = ref();
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
    ellipsis: true,
    tooltip: true
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 80,
    slotName: "fieldStatus",
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
  const res: ResponseResult = await getRoleByType(props.roleTypeId);
  if (res.status === ResponseStatusEnum.OK) {
    tableData.value = res.data;
  }

  loading.value = false;
}

/**
 * 当状态发生变化的时候
 * @param
 * @return
 * @author     :loulan
 * */
const statusChange = async (status:any,data:any)=>{
  const res: ResponseResult = await roleUpdate({
    id: data.id,
    status: status
  });
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

/**
 * 角色类型添加
 * @param
 * @return
 * @author     :loulan
 * */
const add = ()=>{
  infoRef.value.init();
}

/**
 * 角色类型的编辑
 * @param
 * @return
 * @author     :loulan
 * */
const edit = (data:any) => {
  infoRef.value.init(data);
}

/**
 * 点击删除按钮的时候
 * @param
 * @return
 * @author     :loulan
 * */
const del = (data:any)=>{
  dragonConfirm({
    title: '确认提示',
    content: '您确认删除这条数据吗？'
  }).then(async ()=>{
    const res:ResponseResult = await roleDel(data.id);
    if (res.status === ResponseStatusEnum.OK) {
      queryRole();
      DragonNotice.success("删除成功");
    }
  })
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
