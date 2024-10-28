<template>
  <a-modal v-model:visible="modalVisible"
           title="站点角色"
           title-align="start"
           width="550px"
           :mask-closable="false"
           :footer="false"
           @close="close">
    <div style="max-height: 500px">
      <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center">
        <a-select v-model="selectRole" :scrollbar="false" placeholder="请选择角色数据" allow-clear>
            <template v-for="(role,index) in roleSelectData.roleOptions" :key="index">
              <a-option :value="role.id">{{ role.name }}</a-option>
            </template>
        </a-select>
        <a-button type="primary" status="success" :loading="submitLoading" style="margin-left: 30px" @click="addSubmit">
          <template #icon>
            <icon-check/>
          </template>
          <!-- Use the default slot to avoid extra spaces -->
          <template #default>确定添加</template>
        </a-button>
      </div>
      <div style="display: flex;flex-wrap: wrap;flex-direction: row;justify-content: flex-start;margin-top: 20px">
        <div v-for="(role, indexRole) of clientRoleDatas" :key="indexRole"
             class="tagDivClass"
             :style="{backgroundColor: generateRoleTagColor(role.id)}">
          <span style="color: white;user-select: none">{{ role.name }}</span>
          <!-- 只有不是客户端和部门的角色才能删除-->
          <icon-delete
              v-if="!(role.deleteLoading)"
              class="tagDeleteCLass"
              @click="deleteSubmit(role)"
              :size="20"/>
          <a-spin v-else-if="role.deleteLoading" class="tagDeleteLoadingCLass">
            <template #icon>
              <icon-sync :size="20" style="color: white"/>
            </template>
          </a-spin>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {RoleTypeSpecialEnum, StatusEnum} from "../../../common/domain/enums";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {core as coreTool} from "owner-tool-js";
import {
  addRoleResourceDataByRoleAndClient,
  deleteRoleResourceDataByRoleAndClient,
  getRoleByClientId,
  getRoleByType
} from "../../../common/api/system/role";
import {dragonConfirm, DragonMessage, DragonNotice} from "../../../common/domain/component";

const emits = defineEmits(["query"]);

// 确定提交按钮的加载状态
const submitLoading = ref(false);

// 模态框的显示状态
const modalVisible = ref(false);

const clientId = ref();
const clientRoleDatas = ref<Array<any>>([]);
const selectRole = ref();

// 角色下拉框的数据
const roleSelectData: {
  roleOptions: Array<{
    name: string,
    id: number,
    typeId: number
  }>,
} = reactive({
  roleOptions: []
})

/**
 * 生成角色标签的颜色
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const generateRoleTagColor = (roleId: number) => {
  const val: number = roleId % 3;
  if (val == 0) {
    return "#7816ff";
  } else if (val == 1) {
    return "#165dff";
  } else if (val == 2) {
    return "#ff7d00";
  } else {
    return "#f53f3f";
  }
}

/**
 * 获取站点类型的角色数据
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const getRole = async () => {
  const res: ResponseResult = await getRoleByType(RoleTypeSpecialEnum.CLIENT,undefined, StatusEnum.ON);
  if (ResponseStatusEnum.OK == res.status) {
    roleSelectData.roleOptions = res.data;
  }
}

/**
 * 获取指定站点的角色数据
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const getClientRole = async (clientId: number) => {
  const res: ResponseResult = await getRoleByClientId(clientId);
  if (ResponseStatusEnum.OK == res.status) {
    clientRoleDatas.value = res.data;
  }
}

/**
 * 去定添加角色数据
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const addSubmit = async () => {
  if (coreTool.isEmpty(selectRole.value)) {
    DragonMessage.warning("请选择角色");
    return;
  }
  submitLoading.value = true;
  const res: ResponseResult = await addRoleResourceDataByRoleAndClient(selectRole.value, clientId.value);
  if (res.status == ResponseStatusEnum.OK) {
    await getClientRole(clientId.value);
    DragonNotice.success("添加成功");
  }
  submitLoading.value = false;
}

/**
 * 删除指定的角色数据
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const deleteSubmit = async (role: any) => {
  if (coreTool.isEmpty(role)) {
    DragonMessage.warning("请指定删除角色");
    return;
  }
  dragonConfirm({
    title: "提示",
    content: `您确认删除 ${role.name}?`
  }).then(async () => {
    role.deleteLoading = true;
    const res: ResponseResult = await deleteRoleResourceDataByRoleAndClient(role.id, clientId.value);
    if (res.status == ResponseStatusEnum.OK) {
      await getClientRole(clientId.value);
      DragonNotice.success("删除成功");
    }
  })
}

const clear = () => {
  submitLoading.value = false;
  clientId.value = undefined;
  clientRoleDatas.value = [];
  selectRole.value = undefined;
}

/**
 * 对话框关闭触发的事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {
  clear();
  emits("query");
}

onMounted(async () => {
  await getRole();
})

defineExpose({
  init: async (data: any) => {
    clear();
    clientId.value = data.id;
    clientRoleDatas.value = data.clientRoles;
    modalVisible.value = true;
  }
});
</script>

<style scoped>
.tagDivClass {
  margin: 5px;
  padding: 5px 10px;
  border-radius: 10px;
  cursor: default;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center
}

.tagDeleteCLass {
  margin-left: 10px;
  color: white;
  cursor: pointer;
}

.tagDeleteLoadingCLass {
  margin-left: 10px;
}
</style>