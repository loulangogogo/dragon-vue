<script lang="ts" setup>
import Info from './info.vue';
import {onMounted, ref} from "vue";
import {
  getPhoneByUserId,
  pageCurrentUserNextDeptUserList,
  pageUserList,
  userDel
} from "../../../common/api/system/user";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {TableColumnData, TableData} from "@arco-design/web-vue";
import {dragonConfirm, DragonNotice} from "../../../common/domain/component";
import {core as coreTool} from "owner-tool-js";
import {SpecialValueEnum} from "../../../common/domain/enums";


const props = withDefaults(defineProps<{
  // 是否是通过角色查询(角色查询是在角色管理中查询用户)
  isRole: boolean;
  // 高度设置
  contentHeight: number;
  // 是否是部门,部门管理也有用户查询，只能查询指定部门
  isDept:boolean,
  // 下级部门管理菜单，编辑只能编辑下级部门
  isNextDept:boolean,
}>(), {
  isRole: false,
  contentHeight: 0,
  // 是否是部门,部门管理也有用户查询，只能查询指定部门
  isDept:false,
  // 下级部门管理菜单，编辑只能编辑下级部门
  isNextDept:false,
})

const infoRef = ref();

// 表格数据
const tableData = ref();
// 表格列配置
const columns: Array<TableColumnData> = [
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
    width: 150,
    render: (data: { record: TableData, column: TableColumnData, rowIndex: number }) => {
      if (coreTool.isNotExist(data.record?.deptId)) {
        return "无";
      } else {
        return data.record.deptName;
      }
    },
  },
  {
    title: "岗位角色",
    dataIndex: "roleName",
    width: 150,
    ellipsis: true,
    tooltip: true
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
    title: "操作",
    width: 150,
    fixed: "right",
    slotName: "operate"
  },
];

// 表格列配置
const roleDeptColumns: Array<TableColumnData> = [
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
    title: "部门",
    dataIndex: "deptName",
    width: 150,
    render: (data: { record: TableData, column: TableColumnData, rowIndex: number }) => {
      if (coreTool.isNotExist(data.record?.deptId)) {
        return "无";
      } else {
        return data.record.deptName;
      }
    },
  },
  {
    title: "岗位角色",
    dataIndex: "roleName",
    width: 150,
    ellipsis: true,
    tooltip: true
  },
  {
    title: "操作",
    width: 150,
    fixed: "right",
    slotName: "operate"
  },
];


// 查询参数
const initQueryParam = {
  username: undefined,
  name: undefined,
  phone: undefined,
  roleId: undefined,
  deptId: undefined,
  pageCurrent: 1,
  pageSize: 10,
  pageTotal: 0
};
const queryParam = ref({...initQueryParam})

const loading = ref(false);

/**
 * 分页查询数据
 * @param
 * @return
 * @author     :loulan
 * */
const pageList = async () => {
  if (props.isRole && coreTool.isNotExist(queryParam.value.roleId)) {
    // 如果是根据角色查询，那么角色id必须存在
    return;
  }

  if (props.isDept && coreTool.isNotExist(queryParam.value.deptId)) {
    // 如果是根据部门id查询那部门id必须存在
    return;
  }

  // 查询之前进入加载状态
  loading.value = true;
  const res: ResponseResult = await (props.isNextDept?pageCurrentUserNextDeptUserList(queryParam.value):pageUserList(queryParam.value));
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
const search = () => {
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

const del = (data: any) => {
  dragonConfirm({
    title: '确认提示',
    content: '您确认删除这条数据吗？'
  }).then(async () => {
    const res: ResponseResult = await userDel(data.id);
    if (res.status === ResponseStatusEnum.OK) {
      search();
      DragonNotice.success("删除成功");
    }
  })
}


onMounted(() => {
  pageList();
})

defineExpose({
  /**
   * 根据角色查询
   * @param
   * @return
   * @exception
   * @author     :loulan
   * */
  searchByRole: (roleId: any) => {
    queryParam.value = {...initQueryParam};
    tableData.value = [];
    queryParam.value.roleId = roleId;
    pageList();
  },

  /**
   * 根据部门查询
   * @param
   * @return
   * @exception
   * @author     :loulan
   * */
  searchByDept: (deptId: any) => {
    queryParam.value = {...initQueryParam};
    tableData.value = [];
    queryParam.value.deptId = deptId;
    pageList();
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
    <a-button v-if="!props.isRole && !props.isDept" type="primary" status="success" style="margin-left: 20px" @click="add">添加
    </a-button>
  </div>
  <div class="bodyDiv">
    <a-table :columns="(props.isRole || props.isDept)?roleDeptColumns:columns"
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
        <a-button type="primary" size="mini" @click="edit(record)">编辑</a-button>
        <a-button type="primary" status="danger" size="mini" style="margin-left: 10px" @click="del(record)">删除
        </a-button>
      </template>
    </a-table>
  </div>
  <div v-show="false">
    <info ref="infoRef" :is-next-dept="props.isNextDept" @query="search"></info>
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
