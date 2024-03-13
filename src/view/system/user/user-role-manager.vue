<template>
  <a-modal v-model:visible="modalVisible"
           title="角色管理"
           title-align="start"
           width="550px"
           :mask-closable="false"
           :footer="false"
           @close="close">
    <div style="max-height: 500px">
      <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center">
        <a-select v-model="selectRole" :scrollbar="false" placeholder="请选择角色数据">
          <a-optgroup v-for="(roleType,index) in roleSelectData.userRoleTypeOptions" :label="roleType.name"
                      :key="index">
            <template v-for="(role,index) in roleSelectData.roleOptions" :key="index">
              <a-option v-if="role.typeId==roleType.id" :value="role.id">{{ role.name }}</a-option>
            </template>
          </a-optgroup>
        </a-select>
        <a-button type="primary" status="success" :loading="submitLoading" style="margin-left: 30px" @click="addSubmit">
          <template #icon>
            <icon-check/>
          </template>
          <!-- Use the default slot to avoid extra spaces -->
          <template #default>确定添加</template>
        </a-button>
      </div>
      <div style="display: flex;flex-direction: row;justify-content: space-between;margin-top: 20px">
        <a-card v-for="(userRR,indexUserRR) in userRoleTypeAndRoleDatas"
                v-show="userRR.datas.length > 0"
                style="width: 100%"
                :key="indexUserRR"
                :title="userRR.name">
          <a-space>
            <div v-for="(role, indexRole) of userRR.datas" :key="indexRole"
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

          </a-space>
        </a-card>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {RoleTypeSpecialEnum, StatusEnum} from "../../../common/domain/enums";
import {ResponseResult, ResponseStatusEnum} from "../../../common/domain/response";
import {core as coreTool} from "owner-tool-js";
import {
  addRoleResourceDataByRoleAndUser, deleteRoleResourceDataByRoleAndUser,
  getRoleByNoType,
  getRoleByUserId,
  getRoleType
} from "../../../common/api/system/role";
import {dragonConfirm, DragonMessage, DragonNotice} from "../../../common/domain/component";

const emits = defineEmits(["query"]);

// 确定提交按钮的加载状态
const submitLoading = ref(false);

// 模态框的显示状态
const modalVisible = ref(false);

const userId = ref();
const userRoleDatas = ref<Array<any>>([]);
const selectRole = ref();

// 角色下拉框的数据
const roleSelectData: {
  userRoleTypeOptions: Array<{
    name: string,
    id: number
  }>,
  roleTypeOptions: Array<{
    name: string,
    id: number
  }>,
  roleOptions: Array<{
    name: string,
    id: number,
    typeId: number
  }>,
} = reactive({
  userRoleTypeOptions: [],
  roleTypeOptions: [],
  roleOptions: []
})

/**
 * 将用户角色和类型进行匹配计算展示
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const userRoleTypeAndRoleDatas = computed(() => {
  if (coreTool.isEmpty(roleSelectData.roleTypeOptions) || coreTool.isEmpty(userRoleDatas.value)) {
    // 如果角色类型，或者用户角色不存在那么，直接返回空
    return [];
  }

  const result: Array<any> = [];
  for (const roleTypeOption of roleSelectData.roleTypeOptions) {
    const tempData = {
      name: roleTypeOption.name,
      datas: <Array<any>>[]
    }

    for (let i = 0; i < userRoleDatas.value.length; i++) {
      if (userRoleDatas.value[i].typeId == roleTypeOption.id) {
        tempData.datas.push(userRoleDatas.value[i]);
      }
    }
    result.push(tempData);
  }


  return result;
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
 * 获取角色类型
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const getRoleAllType = async () => {
  const res: ResponseResult = await getRoleType();
  if (ResponseStatusEnum.OK == res.status) {
    roleSelectData.roleTypeOptions = res.data;
    roleSelectData.userRoleTypeOptions = res.data.filter((o: any) => (RoleTypeSpecialEnum.CLIENT != o.id && RoleTypeSpecialEnum.DEPT != o.id));
  }
}

/**
 * 获取非客户端和部门的角色数据
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const getRole = async () => {
  const res: ResponseResult = await getRoleByNoType([RoleTypeSpecialEnum.CLIENT, RoleTypeSpecialEnum.DEPT], StatusEnum.ON);
  if (ResponseStatusEnum.OK == res.status) {
    roleSelectData.roleOptions = res.data;
  }
}

/**
 * 获取用户的角色数据
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const getUserRole = async (userId: number) => {
  const res: ResponseResult = await getRoleByUserId(userId);
  if (ResponseStatusEnum.OK == res.status) {
    userRoleDatas.value = res.data;
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
  if (coreTool.isNotExist(selectRole.value)) {
    DragonMessage.warning("请选择角色");
    return;
  }
  submitLoading.value = true;
  const res: ResponseResult = await addRoleResourceDataByRoleAndUser(selectRole.value, userId.value);
  if (res.status == ResponseStatusEnum.OK) {
    await getUserRole(userId.value);
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
  if (coreTool.isNotExist(role)) {
    DragonMessage.warning("请指定删除角色");
    return;
  }
  dragonConfirm({
    title: "提示",
    content: `您确认删除 ${role.name}?`
  }).then(async () => {
    role.deleteLoading = true;
    const res: ResponseResult = await deleteRoleResourceDataByRoleAndUser(role.id, userId.value);
    if (res.status == ResponseStatusEnum.OK) {
      await getUserRole(userId.value);
      DragonNotice.success("删除成功");
    }
  })
}

/**
 * 对话框关闭触发的事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {
  submitLoading.value = false;
  userId.value = undefined;
  userRoleDatas.value = [];
  selectRole.value = undefined;
  emits("query");
}

onMounted(async () => {
  await getRole();
  await getRoleAllType();
})

defineExpose({
  init: async (data: any) => {
    userId.value = data.id;
    userRoleDatas.value = data.roles;
    modalVisible.value = true;
  }
});
</script>

<style scoped>
.tagDivClass {
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