<template>
  <div style="width: 50%;margin: auto;padding: 5px">
    <div align="right">
      <div v-if="isEdit">
        <a-button type="outline" @click="isEdit=false">取消</a-button>
        <a-button type="primary" style="margin-left: 10px" @click="submit">确定</a-button>
      </div>
      <a-button v-else type="outline" @click="isEdit=true">编辑</a-button>
    </div>
    <a-form ref="formRef" :model="formData" :rules="formRules" style="margin-top: 70px">
      <a-form-item field="username" label="用户名" show-colon>
        <span class="spanContent">{{coreTool.isEmpty(formData.username)?"无":formData.username}}</span>
      </a-form-item>
      <a-form-item field="name" label="姓名" show-colon>
        <a-input v-if="isEdit" v-model="formData.name" placeholder="请输入姓名"/>
        <span v-else class="spanContent">{{coreTool.isEmpty(formData.name)?"无":formData.name}}</span>
      </a-form-item>
      <a-form-item field="sex" label="性别" show-colon>
        <a-radio-group v-if="isEdit" v-model="formData.sex">
          <a-radio :value="SexEnum.MAN">男</a-radio>
          <a-radio :value="SexEnum.MEN">女</a-radio>
        </a-radio-group>
        <span v-else class="spanContent">{{coreTool.isEmpty(formData.sexName)?"无":formData.sexName}}</span>
      </a-form-item>
      <a-form-item field="phone" label="手机号码" show-colon>
        <a-input v-if="isEdit" v-model="formData.phone" placeholder="请输入手机号码"/>
        <span v-else class="spanContent">{{coreTool.isEmpty(formData.phone)?"无":formData.phone}}</span>
      </a-form-item>
      <a-form-item field="email" label="邮箱" show-colon>
        <a-input v-if="isEdit" v-model="formData.email" placeholder="请输入邮箱"/>
        <span v-else class="spanContent">{{coreTool.isEmpty(formData.email)?"无":formData.email}}</span>
      </a-form-item>
      <a-form-item field="birthday" label="出生日期" show-colon>
        <a-date-picker v-if="isEdit" v-model="formData.birthday" placeholder="请输入出生日期" style="width: 100%"/>
        <span v-else class="spanContent">{{coreTool.isEmpty(formData.birthday)?"无":formData.birthday}}</span>
      </a-form-item>
      <a-form-item field="idCard" label="身份证号码" show-colon>
        <a-input v-if="isEdit" v-model="formData.idCard" placeholder="请输入身份证号码"/>
        <span v-else class="spanContent">{{coreTool.isEmpty(formData.idCard)?"无":formData.idCard}}</span>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">

// 表单的ref
import {SexEnum} from "../../../../common/domain/enums";
import {computed, onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import {core as coreTool,functionTool} from 'owner-tool-js';
import {currentUserInfo, currentUserInfoUpdate} from "../../../../common/api/frame";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import {UserInfo} from "../../../../common/domain/common";
import {DragonNotice} from "../../../../common/domain/component";

// 用来判断是否处于编辑的状态
const isEdit = ref(false);

const formRef = ref();
const store = useStore();
const formData = ref({
  username: undefined,
  name: undefined,
  sex: undefined,
  sexName: undefined,
  phone: undefined,
  email: undefined,
  birthday: undefined,
  idCard: undefined
});
const formRules = {
  name: {
    required: true,
    message: "姓名不能为空"
  },
  sex: {
    required: true,
    message: "性别不能为空"
  },
  phone: {
    required: true,
    message: "性别不能为空"
  },
  email: {
    required: true,
    message: "性别不能为空"
  },
  birthday: {
    required: true,
    message: "性别不能为空"
  },
  idCard: {
    required: true,
    message: "性别不能为空"
  }
};

/**
 * 提交修改的个人信息
 * @param
 * @return
 * @author     :loulan
 * */
const submit = ()=>{
  formRef.value.validate(async (errors: any) => {
    // 如果没有错误进行提交
    if (coreTool.isUndefined(errors)) {
      const res:ResponseResult = await currentUserInfoUpdate(formData.value);
      if (res.status === ResponseStatusEnum.OK) {
        isEdit.value = false;
        currentUserInfo().then((res: ResponseResult) => {
          if (res.status == ResponseStatusEnum.OK && res.data) {
            const userInfo: UserInfo = res.data;
            store.commit("setUserInfo", userInfo);
          } else {
            // 获取当前用户信息失败，理论上因该退出重新登录的
            console.error("获取用户信息错误。");
          }
        });
        DragonNotice.success("修改成功");
      }
    }
  })
}

watch(
    () => store.getters.userInfo,
    (val: any) => {
       functionTool.combineObj(formData.value,val);
    },
    {
      deep: true,
      immediate: true
    }
)
</script>

<style scoped>
.spanContent{
  font-weight: bolder;
}
</style>
