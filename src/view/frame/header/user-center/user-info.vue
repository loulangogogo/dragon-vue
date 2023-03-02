<template>
  <a-card hoverable class="card">
    <template #extra>
      <a-button type="outline" @click="dealUserinfo">编辑</a-button>
    </template>
    <div align="center" style="padding: 20px">
      <a-form>
        <a-form-item>
          <template #label><span class="spanContentTitle">用户名：</span></template>
          <span class="spanContent">{{coreTool.isEmpty(userInfo.username)?"无":userInfo.username}}</span>
        </a-form-item>
        <a-form-item>
          <template #label><span class="spanContentTitle">姓名：</span></template>
          <span class="spanContent">{{coreTool.isEmpty(userInfo.name)?"无":userInfo.name}}</span>
        </a-form-item>
        <a-form-item>
          <template #label><span class="spanContentTitle">性别：</span></template>
          <span class="spanContent">{{coreTool.isEmpty(userInfo.sexName)?"无":userInfo.sexName}}</span>
        </a-form-item>
        <a-form-item>
          <template #label><span class="spanContentTitle">出生日期：</span></template>
          <span class="spanContent">{{coreTool.isEmpty(userInfo.birthday)?"无":userInfo.birthday}}</span>
        </a-form-item>
      </a-form>
    </div>
  </a-card>

  <!--绑定和解绑手机-->
  <a-modal v-model:visible="modalVisible"
           title="编辑"
           title-align="start"
           width="550px"
           :mask-closable="false"
           layout="horizontal"
           :auto-label-width="true"
           @close="close">
    <a-form ref="formRef" :model="formData" :rules="formRules">
      <a-form-item field="username" label="用户名" show-colon>
        <span class="spanContent">{{coreTool.isEmpty(formData.username)?"无":formData.username}}</span>
      </a-form-item>
      <a-form-item field="name" label="姓名" show-colon>
        <a-input v-model="formData.name" placeholder="请输入姓名"/>
      </a-form-item>
      <a-form-item field="sex" label="性别" show-colon>
        <a-radio-group v-model="formData.sex">
          <a-radio :value="SexEnum.MAN">男</a-radio>
          <a-radio :value="SexEnum.MEN">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="birthday" label="出生日期" show-colon>
        <a-date-picker v-model="formData.birthday" placeholder="请输入出生日期" style="width: 100%"/>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="outline" @click="modalVisible=false">取消</a-button>
      <a-button type="primary" @click="submit" :loading="submitLoading">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">

// 表单的ref
import {SexEnum} from "../../../../common/domain/enums";
import {ref} from "vue";
import {useStore} from "vuex";
import {core as coreTool, functionTool} from 'owner-tool-js';
import {currentUserInfoUpdate} from "../../../../common/api/frame";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {UserInfo} from "../../../../common/domain/common";
import {DragonNotice} from "../../../../common/domain/component";
import {ValidatedError} from "@arco-design/web-vue";

const store = useStore();

// 绑定修改数据之后需要重新获取当前用户信息，修改存在store中的当前用户信息
const emits = defineEmits(["reset-user-info"]);

// 用户信息
const {userInfo} = defineProps<{
  userInfo: UserInfo
}>();

// 弹框显示变量
const modalVisible = ref(false);

// 点击确定加载状态按钮
const submitLoading = ref(false);

const formRef = ref();

const formData = ref({
  username: undefined,
  name: undefined,
  sex: undefined,
  sexName: undefined,
  birthday: undefined,
});
const formRules = {
  name: {
    required: true,
    message: "姓名不能为空"
  }
};

/**
 * 提交修改的个人信息
 * @param
 * @return
 * @author     :loulan
 * */
const submit = ()=>{
  formRef.value.validate(async (errors: undefined | Record<string, ValidatedError>) => {
    // 如果没有错误进行提交
    if (coreTool.isUndefined(errors)) {
      submitLoading.value = true;
      const res:ResponseResult = await currentUserInfoUpdate(formData.value);
      if (res.status === ResponseStatusEnum.OK) {
        modalVisible.value = false;
        emits("reset-user-info");
        DragonNotice.success("修改成功");
      }
      submitLoading.value = false;
    }
  })
}

/**
 * 点击编辑按钮触发
 * @param
 * @return
 * @author     :loulan
 * */
const dealUserinfo = () => {
  functionTool.combineObj(formData.value,store.getters.userInfo);
  modalVisible.value = true;
}

/**
 * 弹框关闭触发的事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {

}
</script>

<style scoped>

/*显示内容的标题*/
.spanContentTitle{
  font-weight: bolder;
  color: black;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}

/*显示内容样式*/
.spanContent{
  font-weight: bolder;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}

/*卡片样式*/
.card {
  height: 100%;
  overflow: hidden;
  text-align: center;
}
</style>
