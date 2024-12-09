<template>
  <div class="headerDiv">
    <a-input-search v-model="searchKey" placeholder="请输入要进行搜索的名称" style="width: 50%" allow-clear/>
    <a-button v-if="menuPermissionIsVisibleAddButton" type="primary" status="success" style="margin-left: 20px"
              @click="add">添加
    </a-button>
  </div>
  <div class="bodyDiv">
    <a-table :columns="columns"
             :data="tableData"
             :stripe="true"
             :show-header="false"
             size="medium"
             :pagination="false"
             :scroll="{
                y:'100%'
              }"
             :scrollbar="false"
             column-resizable
             row-key="id"
             :row-selection="menuPermissionIsVisibleCheckButton?{
               type: 'checkbox',
               fixed: true,
               width: 50
             }:{
               type: 'radio',
               fixed: true,
               width: 50
             }"
             :loading="loading"
             :bordered="{cell:true}"
             v-model:selected-keys="tableCheckSelectedKeys"
             style="user-select: none"
             @row-dblclick="rowClick">
      <template #fieldStatus="{record}">
        <a-switch v-model="record.status" :checked-value="StatusEnum.ON" :unchecked-value="StatusEnum.OFF"
                  @change="(val:any)=>statusChange(val,record)"/>
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
import {computed, inject, ref, watch} from "vue";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {StatusEnum} from "../../../../common/domain/enums";
import {TableColumnData} from "@arco-design/web-vue";
import {getPermissionByMenuId, permissionDel, permissionUpdate} from "../../../../common/api/system/menu";
import {core as coreTool} from "owner-tool-js";
import {dragonConfirm, DragonNotice} from "../../../../common/domain/component";
import {Ref, UnwrapRef} from "@vue/reactivity";

const emits = defineEmits(["selectPermission"]);

const props = defineProps({
  height: {
    type: Number,
    required: true,
    default: 0
  }
});

const infoRef = ref();

// 加载状态
const loading = ref();

// 表格列配置(授权展示和菜单展示不一样)
const columns: Array<TableColumnData> = inject("permissionColumns", [
  {
    title: "名称",
    dataIndex: "name",
    ellipsis: true,
    tooltip: true,
    width: 300,
  },
  {
    title: "编码",
    dataIndex: "code",
    ellipsis: true,
    tooltip: true
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
]);

// 表哥radio选项数据
const tableRadioSeletedKeys: Ref<Array<any>> = ref([]);

// 菜单复选框的选中项
const tableCheckSelectedKeys: Ref<Array<any>> = inject("tableCheckSelectedKeys", tableRadioSeletedKeys)
// 是否显示复选框
const menuPermissionIsVisibleCheckButton: boolean = inject("menuPermissionIsVisibleCheckButton", false);
// 是否显示添加按钮
const menuPermissionIsVisibleAddButton: boolean = inject("menuPermissionIsVisibleAddButton", true);


// 查询参数
const searchKey = ref();
// 查询到的原始数据
const originTableData = ref();
const tableData = computed(() => {
  if (coreTool.isEmpty(searchKey.value)) {
    return originTableData.value;
  } else {
    return originTableData.value.filter((o: any) => o.name.includes(searchKey.value));
  }
})
// 记录传输过来的菜单id
const menuId = ref();

/**
 * 监听单选数据的改变，需要去查询对应权限的url
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
watch(() => tableRadioSeletedKeys.value[0], async (val,oldVal) => {
  if (coreTool.isExist(val) && val != oldVal ) {
    emits("selectPermission", val);
  }
}, {
  deep: true,
  immediate: true
});

/**
 * 当点击行选中的时候
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const rowClick = (record: any) => {
  tableRadioSeletedKeys.value = [record.id];
}

/**
 * 权限数据的查询
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const permissionQuery: Function = inject("permissionQuery", async (menuIdParam: any): Promise<ResponseResult> => {
  return await getPermissionByMenuId(menuIdParam);
});

/**
 * 点击查询按钮的时候
 * @param
 * @return
 * @author     :loulan
 * */
const query = async () => {
  loading.value = true;
  const res: ResponseResult = await permissionQuery(menuId.value);
  if (res.status === ResponseStatusEnum.OK) {
    const datas: Array<any> = res.data;
    if (coreTool.isNotEmpty(datas)) {
      originTableData.value = datas;
    } else {
      originTableData.value = [];
    }
  }
  loading.value = false;
}

/**
 * 当状态发生切换的时候
 * @param
 * @return
 * @author     :loulan
 * */
const statusChange = async (val: number, data: any) => {
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
  }).then(async () => {
    const res: ResponseResult = await permissionDel(data.id);
    if (res.status === ResponseStatusEnum.OK) {
      query();
      DragonNotice.success("删除成功");
    }
  })
}

// 定义开放的方法
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
