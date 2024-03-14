<script lang="ts" setup>
import Info from './info.vue';
import UserDeptRole from "./user-dept-role.vue";
import UserRoleManager from "./user-role-manager.vue";
import {inject, onMounted, ref} from "vue";
import {getPhoneByUserId, pageUserList, userDel} from "../../../common/api/system/user";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {TableColumnData, TableData} from "@arco-design/web-vue";
import {dragonConfirm, DragonNotice} from "../../../common/domain/component";
import {core as coreTool} from "owner-tool-js";

const props = withDefaults(defineProps<{
  // 高度设置
  contentHeight: number,
}>(), {
  contentHeight: 0,
})

// 指向组件的ref
const infoRef = ref();
const userDeptRoleRef = ref();
const userRoleManagerRef = ref();

// 按钮显示的注入数据，（因为该组件被很多其他组件套用，所以这里需要注入判断按钮是否需要显示）
const userIsVisibleAddButton = inject("userIsVisibleAddButton", true);
const userIsVisibleEditButton = inject("userIsVisibleEditButton", true);
const userIsVisibleDelButton = inject("userIsVisibleDelButton", true);
const userIsVisibleDeptRoleButton = inject("userIsVisibleDeptRoleButton", true);
const userIsVisibleRoleManagerButton = inject("userIsVisibleRoleManagerButton", true);

// 表格数据
const tableData = ref();
// 表格列配置
const columns: Array<TableColumnData> = inject("userColumns",[
  {
    title: "姓名/昵称",
    dataIndex: "name",
    width: 150,
    fixed: "left",
  },
  {
    title: "用户名",
    dataIndex: "username",
    width: 200,
  },
  {
    title: "手机号码",
    dataIndex: "phone",
    width: 160,
    slotName: 'phoneSlot'
  },
  {
    title: "邮箱",
    dataIndex: "email",
    width: 200,
  },
  {
    title: "身份证号码",
    dataIndex: "idCard",
    width: 200,
  },
  {
    title: "部门",
    dataIndex: "deptName",
    width: 200,
    ellipsis: true,
    tooltip: true,
    render: (data: { record: TableData, column: TableColumnData, rowIndex: number }) => {
      if (coreTool.isNotExist(data.record?.dept)) {
        return "";
      } else {
        return data.record.dept.name;
      }
    },
  },
  {
    title: "岗位角色",
    dataIndex: "roleName",
    width: 150,
    ellipsis: true,
    tooltip: true,
    render: (data: { record: TableData, column: TableColumnData, rowIndex: number }) => {
      if (coreTool.isEmpty(data.record?.roles)) {
        return "";
      } else {
        return data.record.roles.map((o: any) => o.name).join(",");
      }
    },
  },
  {
    title: "状态",
    dataIndex: "statusName",
    width: 70,
  },
  {
    title: "性别",
    dataIndex: "sexName",
    width: 70,
  },
  {
    title: "出生日期",
    dataIndex: "birthday",
    width: 150,
  },
  {
    title: "注册时间",
    dataIndex: "crtTime",
    width: 180,
  },
  {
    title: "操作",
    width: 130,
    fixed: "right",
    slotName: "operate"
  },
])


// 查询参数
const initQueryParam = {
  username: undefined,
  name: undefined,
  phone: undefined,
  roleId: undefined,
  deptId: undefined,
  stationId: undefined,
  pageCurrent: 1,
  pageSize: 10,
  pageTotal: 0
};
const queryParam = ref({...initQueryParam})

// 加载状态
const loading = ref(false);


/**
 * 分页查询用户的方法
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const pageUsers:Function = inject("pageUserList",async (param:any):Promise<ResponseResult>=>{
  const res: ResponseResult = await pageUserList(queryParam.value);
  return res;
})

/**
 * 分页查询数据
 * @param
 * @return
 * @author     :loulan
 * */
const pageList = async () => {
  // 查询之前进入加载状态
  loading.value = true;
  const res: ResponseResult = await pageUsers(queryParam.value);
  if (res.status === ResponseStatusEnum.OK) {
    const data = res.data;
    tableData.value = data.records;
    queryParam.value.pageTotal = data.total;
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
const search =  () => {
  queryParam.value.pageCurrent = 1;
  pageList();
}

/**
 * 当页码发生变化的时候
 * @param
 * @return
 * @author     :loulan
 * */
const pageChange = (pageCurrent: number) => {
  queryParam.value.pageCurrent = pageCurrent;
  pageList();
}

/**
 * 当每页的数目发生变化的时候
 * @param
 * @return
 * @author     :loulan
 * */
const pageSizeChange = (pageSize: number) => {
  queryParam.value.pageSize = pageSize;
  pageList();
}

/**
 * 添加操作
 * @param
 * @return
 * @author     :loulan
 * */
const add = () => {
  infoRef.value.init();
}

/**
 * 用户的编辑
 * @param
 * @return
 * @author     :loulan
 * */
const edit = (data: any) => {
  infoRef.value.init(data);
}

/**
 * 角色管理按钮点击
 * @param       
 * @return
 * @exception  
 * @author     :loulan
 * */
const userRoleManagerClick = (data:any)=>{
  userRoleManagerRef.value.init(data);
}

/**
 * 部门岗位按钮进行点击操作
 * @param       
 * @return
 * @exception  
 * @author     :loulan
 * */
const userDeptRoleClick = (data:any)=>{
  userDeptRoleRef.value.init(data);
}

/**
 * 根据用户的id获取用户的手机号码
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const getPhone = (data: any) => {
  getPhoneByUserId(data.id).then((res: ResponseResult) => {
    if (res.status === ResponseStatusEnum.OK) {
      data["phoneReal"] = res.data;
      data["phoneEye"] = true;
    }
  });
};


/**
 * 用户数据的删除操作
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const userDelData:Function = inject("userDelData", async (param: any): Promise<ResponseResult> => {
  return await userDel(param);
})

/**
 * 点击删除用户数据
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const del = (data: any) => {
  dragonConfirm({
    title: '确认提示',
    content: '您确认删除这条数据吗？'
  }).then(async () => {
    const res: ResponseResult = await userDelData(data.id);
    if (res.status === ResponseStatusEnum.OK) {
      search();
      DragonNotice.success("删除成功");
    }
  })
}


onMounted(() => {
  search();
})

defineExpose({
  /**
   * 初始化查询
   * @author     :loulan
   * */
  initSearch: ()=>{
    search();
  },

  /**
   * 重置数据
   * @param
   * @return
   * @exception
   * @author     :loulan
   * */
  reset: ()=>{
    queryParam.value = {...initQueryParam};
    tableData.value = [];
  }
});
</script>

<template>
  <div class="headerDiv">
    <a-input v-model="queryParam.username" style="width: 200px" placeholder="请输入用户名" allow-clear/>
    <a-input v-model="queryParam.name" style="width: 200px;margin-left: 20px" placeholder="请输入姓名" allow-clear/>
    <a-input v-model="queryParam.phone" style="width: 200px;margin-left: 20px" placeholder="请输入手机号码"
             allow-clear/>
    <a-button type="primary" style="margin-left: 20px" @click="search">查询</a-button>
    <a-button v-if="userIsVisibleAddButton" type="primary" status="success" style="margin-left: 20px" @click="add">添加</a-button>
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
                y: '100%'
              }"
             :scrollbar="false"
             column-resizable
             :bordered="{cell:true}"
             :loading="loading"
             @page-size-change="pageSizeChange"
             @page-change="pageChange">
      <template #phoneSlot="{ record }">
        <span v-if="record.phoneEye == true">{{ record.phoneReal }}</span>
        <span v-else>{{ record.phone }}</span>
        &nbsp;
        <span v-if="record.phone">
          <icon-eye-invisible
              v-if="record.phoneEye == true"
              class="phoneEyeClass"
              @click="record.phoneEye = false"
          ></icon-eye-invisible>
          <icon-eye v-else class="phoneEyeClass" @click="getPhone(record)"></icon-eye>
        </span>
      </template>
      <template #operate="{record}">
        <a-dropdown :popup-max-height="false">
          <a-button type="primary" size="mini">点击操作&nbsp;<icon-down/></a-button>
          <template #content>
            <a-doption v-if="userIsVisibleRoleManagerButton" @click="userRoleManagerClick(record)">
              <span style="color: #30ec06">角色管理</span>
            </a-doption>
            <a-doption v-if="userIsVisibleDeptRoleButton" @click="userDeptRoleClick(record)">
              <span style="color: coral">部门岗位</span>
            </a-doption>
            <a-doption v-if="userIsVisibleEditButton" @click="edit(record)">
              <span style="color: blue">编辑</span>
            </a-doption>
            <a-doption v-if="userIsVisibleDelButton" @click="del(record)">
              <span style="color: red">删除</span>
            </a-doption>
          </template>
        </a-dropdown>
      </template>
    </a-table>
  </div>
  <div v-show="false">
    <info v-if="userIsVisibleEditButton || userIsVisibleAddButton" ref="infoRef" @query="search"></info>
    <user-dept-role v-if="userIsVisibleDeptRoleButton"  ref="userDeptRoleRef" @query="search"></user-dept-role>
    <user-role-manager v-if="userIsVisibleRoleManagerButton" ref="userRoleManagerRef" @query="search"></user-role-manager>
  </div>
</template>

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

.phoneEyeClass {
  cursor: pointer;
}
</style>
