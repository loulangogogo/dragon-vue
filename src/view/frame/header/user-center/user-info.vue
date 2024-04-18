<template>
  <a-card hoverable class="card">
    <template #extra>
      <a-button type="outline" @click="dealUserinfo">编辑</a-button>
    </template>
    <div style="padding: 20px;height: 100%;overflow: auto;">
      <a-row style="width:100%;">
        <a-col :span="5">
          <a-avatar shape="circle" @click="dealHeaderImageClick" :size="120">
            <img alt="无" style="width: 120px;height: 120px;"
              :src="userInfo.headerImageFileInfo?.url" />
          </a-avatar>
        </a-col>
        <a-col :span="19">
          <a-form :model="{}" :label-col-props="{ span: 7 }" :wrapper-col-props="{ span: 17 }">
            <a-form-item>
              <template #label><span class="spanContentTitle">用户名：</span></template>
              <span class="spanContent">{{ coreTool.isEmpty(userInfo.username) ? "无" : userInfo.username }}</span>
            </a-form-item>
            <a-form-item>
              <template #label><span class="spanContentTitle">姓名：</span></template>
              <span class="spanContent">{{ coreTool.isEmpty(userInfo.name) ? "无" : userInfo.name }}</span>
            </a-form-item>
            <a-form-item>
              <template #label><span class="spanContentTitle">性别：</span></template>
              <span class="spanContent">{{ coreTool.isEmpty(userInfo.sexName) ? "无" : userInfo.sexName }}</span>
            </a-form-item>
            <a-form-item>
              <template #label><span class="spanContentTitle">出生日期：</span></template>
              <span class="spanContent">{{ coreTool.isEmpty(userInfo.birthday) ? "无" : userInfo.birthday }}</span>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </div>
  </a-card>

  <!--绑定和解绑手机-->
  <a-modal v-model:visible="modalVisible" title="编辑" title-align="start" width="550px" :mask-closable="false"
    layout="horizontal" :auto-label-width="true" @close="close">
    <a-form ref="formRef" :model="formData" :rules="formRules">
      <a-form-item field="username" label="用户名" show-colon>
        <span class="spanContent">{{ coreTool.isEmpty(formData.username) ? "无" : formData.username }}</span>
      </a-form-item>
      <a-form-item field="name" label="姓名" show-colon>
        <a-input v-model="formData.name" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item field="sex" label="性别" show-colon>
        <a-radio-group v-model="formData.sex">
          <a-radio :value="SexEnum.MAN">男</a-radio>
          <a-radio :value="SexEnum.MEN">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="birthday" label="出生日期" show-colon>
        <a-date-picker v-model="formData.birthday" placeholder="请输入出生日期" style="width: 100%" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="outline" @click="modalVisible = false">取消</a-button>
      <a-button type="primary" @click="submit" :loading="submitLoading">确定</a-button>
    </template>
  </a-modal>

  <!-- 头像更换绑定 -->
  <a-modal v-model:visible="imageModalVisible" title="头像设置" title-align="start" :width="300" :mask-closable="false"
    layout="horizontal" :auto-label-width="true" @close="imageModalClose">
    <div style="display: flex;justify-content: center;align-items: center;height: 270px;">
      <a-upload :show-file-list="false" :on-before-upload="uploadFileEvent"  :fileList="file ? [file] : []" class="uploadHeaderImage">
        <template #upload-button>
          <div v-if="file && file.url" class="upload-image"
            style="display: flex;justify-content: center;align-items: center;background-size:100% 100%;position: relative;"
            :style="{ backgroundImage: 'url(' + file.url + ')' }">
            <div class="arco-upload-list-picture-mask"
              style="display: flex;justify-content: center;align-items: center;">
              <IconEdit size="40" />
            </div>
          </div>
          <div v-else class="arco-upload-picture-card">
            <div class="arco-upload-picture-card-text">
              <IconPlus size="40" />
              <div style="margin-top: 10px; font-weight: 600">图片上传</div>
            </div>
          </div>
        </template>
      </a-upload>
    </div>
    <template #footer>
      <a-button type="outline" @click="imageModalVisible = false">取消</a-button>
      <a-button type="primary" @click="submitHearImage" :loading="submitLoading">确定</a-button>
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
import {FileInfo, UserInfo} from "../../../../common/domain/common";
import {DragonMessage, DragonNotice} from "../../../../common/domain/component";
import {ValidatedError} from "@arco-design/web-vue";
import {uploadFile} from '../../../../common/api/file';

const store = useStore();

// 绑定修改数据之后需要重新获取当前用户信息，修改存在store中的当前用户信息
const emits = defineEmits(["reset-user-info"]);

// 用户信息
const { userInfo } = defineProps<{
  userInfo: UserInfo
}>();

// 编辑数据弹框显示变量
const modalVisible = ref(false);

// 图片处理弹框显示变量
const imageModalVisible = ref(false);

// 图片上传是否正常，主要用在进度条的展示上
const imageIsUploadNormal = ref(true);

// 文件数据的初始化值
const fileInitData = {
  id: undefined,
  url: "",
  path: undefined,
  name: undefined,
  percent: 0
}
const file = ref();

// 点击确定加载状态按钮
const submitLoading = ref(false);

const formRef = ref();

// 表单要提交的数据对象初始化值
const formInitData = {
  username: undefined,
  name: undefined,
  sex: undefined,
  sexName: undefined,
  birthday: undefined,
  headerImageFileId: undefined
}

// 用户的信息数据
const formData = ref<any>({});
const formRules = {
  name: {
    required: true,
    message: "姓名不能为空"
  }
};


/**
 * 文件头像的上传
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const uploadFileEvent = (optionFile: File): Promise<boolean | File> => {
  let tempFile: File | undefined = optionFile;

  if (!tempFile) {
    DragonMessage.warning("上传文件为空");
    return new Promise<boolean>((resolve: any) => resolve(false));
  }

  if (tempFile.size > 1000000) {
    DragonMessage.warning("上传图片不能超过1M");
    return new Promise<boolean>((resolve: any) => resolve(false));
  }

  // 先生成要提交的文件对象
  const formData = new FormData();
  formData.append("file", <Blob>optionFile);

  // 后端上传数据
  uploadFile(false, formData).then((res: ResponseResult) => {
    if (res.status === ResponseStatusEnum.OK) {
      const resData: any = res.data;
      file.value.url = resData.url;
      file.value.id=resData.id;
      file.value.percent = 1;
    }else {
      // 设置上传进度为0
      file.value.percent = 0;
    }
  });


  return new Promise<boolean>((resolve: any) => resolve(false));
}


/**
 * 提交修改个人头像
 * @param
 * @return
 * @author     :loulan
 * */
const submitHearImage = async()=>{
  if(coreTool.isNotExist(file) || coreTool.isEmpty(file.value?.id)){
    DragonMessage.warning("头像图片未设置。");
  }
  submitLoading.value = true;
  formData.value.headerImageFileId=file.value.id;
  const res: ResponseResult = await currentUserInfoUpdate(formData.value);
  if (res.status === ResponseStatusEnum.OK) {
    imageModalVisible.value = false;
    emits("reset-user-info");
    DragonNotice.success("设置成功");
  }
  submitLoading.value = false;
}

/**
 * 提交修改的个人信息
 * @param
 * @return
 * @author     :loulan
 * */
const submit = () => {
  formRef.value.validate(async (errors: undefined | Record<string, ValidatedError>) => {
    // 如果没有错误进行提交
    if (coreTool.isUndefined(errors)) {
      submitLoading.value = true;
      const res: ResponseResult = await currentUserInfoUpdate(formData.value);
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
  // 先复制初始化的值
  functionTool.combineObj(formData.value,formInitData);
  // 然后数据对象进行赋值
  const currentUserInfo:UserInfo = store.getters.userInfo;
  formData.value.name=currentUserInfo.name;
  formData.value.username = currentUserInfo.username;
  formData.value.sex = currentUserInfo.sex;
  formData.value.sexName = currentUserInfo.sexName;
  formData.value.birthday = currentUserInfo.birthday;
  formData.value.headerImageFileId  = undefined;

  modalVisible.value = true;
}

/**
 * 点击头像处理触发方法
 * @param
 * @return
 * @author     :loulan
 * */
const dealHeaderImageClick = () => {
  // 先赋值初始化的值
  functionTool.combineObj(formData.value,formInitData);

  file.value = functionTool.combineObj({},fileInitData);
  const headerImageFileInfo:FileInfo = store.getters.userInfo.headerImageFileInfo;
  if (coreTool.isExist(headerImageFileInfo)){
    file.value.url = headerImageFileInfo.url;
  }
  file.value.percent = 0;

  imageIsUploadNormal.value = true;
  imageModalVisible.value = true;
}

/**
 * 头像图片弹框关闭触发的事件
 * @param
 * @return
 * @author     :loulan
 * */
const imageModalClose = () => {
  // 初始化清空
  functionTool.combineObj(formData.value,formInitData);

  //初始化清空
  file.value = functionTool.combineObj({},fileInitData);

  imageIsUploadNormal.value = true;
}

/**
 * 弹框关闭触发的事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {
  // 初始化清空
  functionTool.combineObj(formData.value,formInitData);
}
</script>

<style scoped lang="less">
.uploadHeaderImage {
  .arco-upload-picture-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 250px;
    height: 250px;
  }

  .upload-image {
    width: 250px;
    height: 250px;
  }
}

/*显示内容的标题*/
.spanContentTitle {
  font-weight: bolder;
  color: black;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/*显示内容样式*/
.spanContent {
  font-weight: bolder;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/*卡片样式*/
.card {
  height: 100%;
  overflow: hidden;
  text-align: center;
}
</style>
