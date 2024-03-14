<script lang="ts" setup>
import {arrayTool, core as coreTool} from 'owner-tool-js';
import {computed, inject, nextTick, onMounted, ref} from 'vue';
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import Info from './info.vue';
import {dragonConfirm, DragonNotice} from "../../../../common/domain/component";
import {deptDel, deptUpdate, getAllDept} from "../../../../common/api/system/dept";
import {SpecialValueEnum} from "../../../../common/domain/enums";

const emits = defineEmits(["select"]);

const props = withDefaults(defineProps<{
  // 高度设置
  contentHeight: number;
}>(), {
  contentHeight: 0,
})

// 添加编辑组件的ref
const infoRef = ref();
// 菜单树的ref
const treeRef = ref();
// 搜索值
const searchKey = ref();
// 原始树数据
const parentTreeData = ref<Array<any>>([]);
const originTreeData = ref<Array<any>>([]);

// 树的加载状态
const treeLoading = ref(false);

// 树数据
const treeData = computed(() => {
  if (coreTool.isEmpty(searchKey.value)) {
    nextTick(() => {
      treeRef.value.expandAll(false);
    })

    return originTreeData.value;
  } else {
    nextTick(() => {
      // 查询的时候一定要展开节点才能看到查询的内容
      treeRef.value.expandAll(true);
    })
    return searchData(searchKey.value);
  }
})

// 是否显示编辑删除按钮
const deptIsVisibleEditDelButton = inject("deptIsVisibleEditDelButton", true);
const deptIsVisibleAddButton = inject("deptIsVisibleAddButton", true);


/**
 * 生成部门树的方法
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const generateDeptTree: Function = inject("generateDeptTree", async (parentTreeData: Array<any>, deptTreeData: Array<any>) => {
  deptTreeData.length = 0;
  parentTreeData.length = 0;
  const res: ResponseResult = await getAllDept();
  if (res.status === ResponseStatusEnum.OK && res.data) {
    if (res.data?.length > 0) {
      deptTreeData.push(...(arrayTool.arrayToTree(res.data, "id", "pid", SpecialValueEnum.TOP)));
      parentTreeData.push({
        id: SpecialValueEnum.TOP,
        name: "顶级",
        children: deptTreeData
      })
    }
  }
})

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
 * 部门删除数据
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const deptDelData: Function = inject("deptDelData", async (param: any): Promise<ResponseResult> => {
  return await deptDel(param);
})

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
  }).then(async () => {
    const res: ResponseResult = await deptDelData(nodeData.id);
    if (res.status === ResponseStatusEnum.OK) {
      getDepts();
      DragonNotice.success("删除成功");
    }
  })
}

const getDepts = async () => {
  treeLoading.value = true;
  await generateDeptTree(parentTreeData.value, originTreeData.value);
  treeLoading.value = false;
}

/**
 * 当树节点被点击的时候
 * @param
 * @return
 * @author     :loulan
 * */
const treeSelect = (selectedKeys: Array<string | number>) => {
  const deptId = selectedKeys[0];
  emits('select', deptId);
}

onMounted(() => {
  getDepts()
})
</script>

<template>
  <div class="queryDiv">
    <a-row>
      <a-col :span="20">
        <a-input-search v-model="searchKey" placeholder="请输入要进行搜索的名称" allow-clear/>
      </a-col>
      <a-col v-if="deptIsVisibleAddButton" :span="4">
        <div align="right">
          <a-button type="primary" status="success" @click="add">添加</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
  <a-spin :loading="treeLoading" :size="30" style="width: 100%" class="treeDiv">
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
        <icon-caret-down class="treeSwitcherIcon" v-if="!isLeaf"/>
      </template>
      <template v-if="deptIsVisibleEditDelButton" #extra="nodeData">
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
  </a-spin>


  <div v-show="false">
    <Info ref="infoRef"  :dept-tree="parentTreeData" @query="getDepts"></Info>
  </div>
</template>

<style scoped>
/*查询条件部分样式设置*/
.queryDiv {
  height: 35px;
  line-height: 35px;
  overflow: hidden;
}

/*树部分样式设置*/
.treeDiv {
  /*其中35是查询部分高度，5属于安全高度*/
  height: v-bind(contentHeight-45+ 'px');
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


.treeSwitcherIcon {
  font-size: 16px;
}
</style>
