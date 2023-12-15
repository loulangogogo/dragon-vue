<template>
  <div class="queryDiv">
    <a-row>
      <a-col :span="20">
        <a-input-search v-model="searchKey"  placeholder="请输入要进行搜索的名称" allow-clear/>
      </a-col>
      <a-col :span="4">
        <div align="right">
          <a-button type="primary" status="success" @click="add">添加</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
  <div class="treeDiv">
    <a-tree ref="treeRef"
            block-node
            :data="treeData"
            :field-names="{
              key: 'id',
              title: 'name'
            }"
            @select="treeSelect">
      <template #switcher-icon="{ isLeaf }">
        <icon-caret-right class="treeSwitcherIcon" v-if="isLeaf"/>
        <icon-caret-down class="treeSwitcherIcon" v-if="!isLeaf" />
      </template>
      <template #extra="nodeData">
        <a-space align="center">
          <div class="treeNodeOperateIconDiv" align="center">
            <icon-edit class="treeNodeOperateIcon" style="color: blue" @click="edit(nodeData)"/>
          </div>
          <div class="treeNodeOperateIconDiv" align="center">
            <icon-delete class="treeNodeOperateIcon" style="color: red" @click="del(nodeData)"/>
          </div>
        </a-space>
      </template>
    </a-tree>
  </div>
  <div v-show="false">
    <Info ref="infoRef" :datas="originListData" :is-next-dept="props.isNextDept" @query="getDepts"></Info>
  </div>
</template>
<script lang="ts" setup>
import {core as coreTool,arrayTool} from 'owner-tool-js';
import {computed, nextTick, onMounted, ref} from 'vue';
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import Info from './info.vue';
import {dragonConfirm, DragonNotice} from "../../../../common/domain/component";
import {deptDel, getAllDept, getCurrentUserNextDept} from "../../../../common/api/system/dept";
import {SpecialValueEnum} from "../../../../common/domain/enums";
import {UserInfo} from "../../../../common/domain/common";
import {useStore} from "vuex";

const emits = defineEmits(["select"]);

const props = withDefaults(defineProps<{
  // 高度设置
  contentHeight: number;
  isNextDept: boolean
}>(), {
  contentHeight: 0,
  isNextDept:false
})

const storeGetters = useStore().getters;
const currentUser = computed<UserInfo>(()=>storeGetters.userInfo);


// 添加编辑组件的ref
const infoRef = ref();
// 菜单树的ref
const treeRef = ref();
// 原始树数据
const originTreeData = ref(new Array<any>());
const originListData= ref([]);
// 搜索值
const searchKey = ref();
// 树数据
const treeData = computed(() => {
  if (coreTool.isEmpty(searchKey.value)) {
    nextTick(()=>{
      treeRef.value.expandAll(false);
    })
    return originTreeData.value;
  } else {
    nextTick(()=>{
      // 查询的时候一定要展开节点才能看到查询的内容
      treeRef.value.expandAll(true);
    })
    return searchData(searchKey.value);
  }
})

/**
 * 获取部门信息
 * @param
 * @return
 * @author     :loulan
 * */
const getDepts = async ()=>{
  // 如果是下级部门则只能获取当前用户下级所有部门数据
  const res: ResponseResult = await (props.isNextDept?getCurrentUserNextDept():getAllDept());
  if (res.status === ResponseStatusEnum.OK && res.data) {
    originListData.value = res.data;
    originTreeData.value = arrayTool.arrayToTree(originListData.value, "id", "pid", props.isNextDept?currentUser.value.deptId:SpecialValueEnum.TOP);
  }
}

/**
 * 搜索数据,并组合成一个新的数组数据
 * @param
 * @return
 * @author     :loulan
 * */
const searchData = (keyword: string) => {
  const loop = (data: Array<any>): Array<any> => {
    const result: Array<any> = [];
    data.forEach((item: any) => {
      if (item.name.toLowerCase().includes(keyword.toLowerCase())) {
        result.push({...item});
      } else if (coreTool.isNotEmpty(item.children)) {
        const filterData: Array<any> = loop(item.children);
        if (coreTool.isNotEmpty(filterData)) {
          result.push({
            ...item,
            children: filterData
          })
        }
      }
    })
    return result;
  }

  return loop(originTreeData.value);
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
const edit = (nodeData: any) => {
  infoRef.value.init(nodeData);
}

/**
 * 点击删除按钮的时候
 * @param
 * @return
 * @author     :loulan
 * */
const del = (nodeData: any) => {
  dragonConfirm({
    title: '确认提示',
    content: '您确认删除这条数据吗？'
  }).then(async ()=>{
    const res:ResponseResult = await deptDel(nodeData.id);
    if (res.status === ResponseStatusEnum.OK) {
      getDepts();
      DragonNotice.success("删除成功");
    }
  })
}

/**
 * 当树节点被点击的时候
 * @param
 * @return
 * @author     :loulan
 * */
const treeSelect = (selectedKeys: Array<string | number>)=>{
  const deptId = selectedKeys[0];
  emits('select', deptId);
}

onMounted(()=>{
  getDepts();
})
</script>

<style scoped>
/*查询条件部分样式设置*/
.queryDiv{
  height: 35px;
  line-height: 35px;
  overflow: hidden;
}

/*树部分样式设置*/
.treeDiv {
  /*其中35是查询部分高度，5属于安全高度*/
  height: v-bind(contentHeight-40+ 'px');
  overflow: auto;
}

/*树的额外部分按钮样式调整*/
.treeNodeOperateIconDiv {
  width: 25px;
}
.treeNodeOperateIcon {
  font-size: 20px;
}
.treeNodeOperateIcon:hover {
  font-size: 25px;
}


.treeSwitcherIcon{
  font-size: 16px;
}
</style>
