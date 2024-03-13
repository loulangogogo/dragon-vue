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
             page-position="bottom"
             :pagination="roleIsPage?{
                total: queryParam.pageTotal,
                showTotal: true,
                showJumper: true,
                showPageSize: true,
                pageSizeOptions:[10,20,30,40,50],
                current:queryParam.pageCurrent,
                pageSize: queryParam.pageSize,
              }:false"
             :scroll="{
                y:'100%'
              }"
             :scrollbar="false"
             column-resizable
             :bordered="{cell:true}"
             @page-size-change="pageSizeChange"
             @page-change="pageChange"
             :loading="loading">
      <template #fieldStatus="{record}">
        <a-switch v-model="record.status" :checked-value="StatusEnum.ON" :unchecked-value="StatusEnum.OFF"
                  @change="(val:any)=>statusChange(val,record)"/>
      </template>
      <template #operate="{record}">
        <a-space>
          <a-button type="primary" status="warning" size="mini" @click="permissionEdit(record)">权限编辑</a-button>
          <a-button v-if="(roleTypeId != RoleTypeSpecialEnum.CLIENT) && roleIsVisibleLookUserButton" type="primary" status="success" size="mini"
                    @click="lookUsers(record)">查看用户
          </a-button>
          <a-button type="primary" size="mini" @click="edit(record)">编辑</a-button>
          <a-button type="primary" status="danger" size="mini" @click="del(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
  <div v-show="false">
    <Info ref="infoRef" :role-type-id="roleTypeId" @query-role="queryRole"></Info>
    <permission ref="permissionRef"></permission>
    <look-user v-if="roleIsVisibleLookUserButton" ref="lookUserRef"></look-user>
  </div>
</template>

<script lang="ts" setup>
import Info from './info.vue';
import Permission from './permission.vue';
import LookUser from "./look-user.vue";
import {inject, onMounted, reactive, ref} from "vue";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {roleDel, rolePageList, roleUpdate} from "../../../../common/api/system/role";
import {RoleTypeSpecialEnum, StatusEnum} from "../../../../common/domain/enums";
import {dragonConfirm, DragonNotice} from "../../../../common/domain/component";

const props = withDefaults(defineProps<{
  // 高度
  height: number,
  // 角色类型
  roleTypeId: number,
}>(), {
  height: 0,
  roleTypeId: undefined,
})

// 添加编辑组件的ref
const infoRef = ref();
// 查看用户组件的ref
const lookUserRef = ref();

const permissionRef = ref();
// 表格数据
const tableData = ref();

// 角色页面是否进行分页
const roleIsPage:boolean = inject("roleIsPage", true);

// 是否显示查看用户按钮
const roleIsVisibleLookUserButton:boolean = inject("roleIsVisibleLookUserButton", true);

// 表格列配置
const columns: Array<any> = inject<Array<any>>("roleColumns", [
  {
    title: "角色名称",
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
    width: props.roleTypeId == RoleTypeSpecialEnum.CLIENT ? 220 : 300,
    fixed: "right",
    slotName: "operate"
  },
]);

// 查询参数
const queryParam = reactive({
  name: undefined,
  roleTypeId: undefined,
  deptId: undefined,
  pageCurrent: 1,
  pageSize: 10,
  pageTotal: 0
})

const loading = ref(false);

const getRoleDatas:Function = inject("getRoleData",async (param:any):Promise<ResponseResult>=>{
  const res: ResponseResult = await rolePageList(param);
  return res;
})

/**
 * 分页查询数据
 * @param
 * @return
 * @author     :loulan
 * */
const queryRole = async () => {
  // 查询之前进入加载状态
  loading.value = true;
  if (!roleIsPage) {
    const res: ResponseResult = await getRoleDatas(queryParam);
    if (res.status === ResponseStatusEnum.OK) {
      tableData.value = res.data;
    }
  }else {
    queryParam.roleTypeId = <any>props.roleTypeId;
    const res: ResponseResult = await getRoleDatas(queryParam);
    if (res.status === ResponseStatusEnum.OK) {
      const data = res.data;
      tableData.value = data.records;
      queryParam.pageTotal = data.total;
    }
  }
  loading.value = false;
}

/**
 * 当状态发生变化的时候
 * @param
 * @return
 * @author     :loulan
 * */
const statusChange = async (status: any, data: any) => {
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
const search = () => {
  queryParam.pageCurrent = 1;
  queryRole();
}

/**
 * 当页码发生变化的时候
 * @param
 * @return
 * @author     :loulan
 * */
const pageChange = (pageCurrent: number) => {
  queryParam.pageCurrent = pageCurrent;
  queryRole();
}

/**
 * 当每页的数目发生变化的时候
 * @param
 * @return
 * @author     :loulan
 * */
const pageSizeChange = (pageSize: number) => {
  queryParam.pageSize = pageSize;
  queryRole();
}

/**
 * 角色类型添加
 * @param
 * @return
 * @author     :loulan
 * */
const add = () => {
  infoRef.value.init();
}

/**
 * 角色类型的编辑
 * @param
 * @return
 * @author     :loulan
 * */
const edit = (data: any) => {
  infoRef.value.init(data);
}


/**
 * 角色数据的删除
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const roleDelData:Function = inject("roleDelData",async (param:any):Promise<ResponseResult>=>{
  return await roleDel(param);
})

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
    const res: ResponseResult = await roleDelData(data.id);
    if (res.status === ResponseStatusEnum.OK) {
      queryRole();
      DragonNotice.success("删除成功");
    }
  })
}

/**
 * 查看该角色下存在的用户
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const lookUsers = (data: any) => {
  lookUserRef.value.init(data);
}

/**
 * 进行权限编辑
 * @param
 * @return
 * @author     :loulan
 * */
const permissionEdit = (data: any) => {
  permissionRef.value.init(data.id);
}


onMounted(() => {
  queryRole();
})

defineExpose({
  /**
   * 根据部门查询数据
   * @param
   * @return
   * @exception
   * @author     :loulan
   * */
  initSearch: () => {
    queryRole();
  }
});
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
