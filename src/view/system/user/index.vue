<template>
  <div class="headerDiv">
    <a-input style="width: 200px" placeholder="请输入用户名" allow-clear />
    <a-input style="width: 200px;margin-left: 20px" placeholder="请输入姓名" allow-clear />
    <a-input style="width: 200px;margin-left: 20px" placeholder="请输入手机号码" allow-clear />
    <a-button type="primary" style="margin-left: 20px">查询</a-button>
  </div>
  <div class="bodyDiv">
    <a-table :columns="columns"
             :data="tableData"
             :stripe="true"
             page-position="bottom"
             :pagination="{
                total: 300,
                showTotal: true,
                showJumper: true,
                showPageSize: true,
                pageSizeOptions:[10,20,30,40,50],
                defaultPageSize: 10,
              }"
             :scroll="{
                y:'100%'
              }"
             column-resizable
             :bordered="{cell:true}">
      <template #operate>
        <a-button type="primary">按钮</a-button>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>

import {reactive, ref} from "vue";

const props = defineProps({
  contentHeight:{
    type: Number,
    required: true,
    default: 0
  }
});

// 表格数据
const tableData = reactive([
  {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  }, {
    name: "杨晓强",
    userName: "loulan",
    phone: "18509376997",
    email: "loulangogogo@163.com",
    status: "启用",
    sex: "女",
    birthday: "2022-09-22 23:59:59",
    idCard: "123456789123456789",
  },
]);
// 表格列配置
const columns = reactive([
  {
    title: '姓名',
    dataIndex: 'name',
    width: 150,
    fixed: 'left',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    width: 300,
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    width: 200,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 300,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 100,
  },
  {
    title: '出生日期',
    dataIndex: 'birthday',
    width: 300,
  },
  {
    title: '身份证号码',
    dataIndex: 'idCard',
    width: 300,
  },
  {
    title: '操作',
    width: 100,
    fixed: 'right',
    slotName: "operate"
  },
]);
</script>

<style scoped>
.headerDiv{
  height: v-bind(70+'px');
  line-height: 70px;
  padding: 0 5px;
}

.bodyDiv{
  /*70头部div的高度，5是多一个安全距离*/
  height: v-bind(contentHeight-75+'px');
}
</style>
