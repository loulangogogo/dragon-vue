<template>
  <div class="queryDiv">
    <a-row>
      <a-col :span="20">
        <a-input-search v-model="searchKey"  placeholder="请输入要进行搜索的名称" allow-clear/>
      </a-col>
      <a-col :span="4" v-if="!isRolePermission">
        <div align="right">
          <a-button type="primary" status="success" @click="add">添加</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
  <div class="treeDiv">
    <a-tree ref="menuTreeRef"
            block-node
            :data="treeData"
            :field-names="{
              key: 'id',
              title: 'name',
              icon: 'existIcon'
            }"
            :checkable="isRolePermission"
            :check-strictly="true"
            v-model:checked-keys="selectedKeys"
            @select="treeSelect">
      <template #switcher-icon="{ isLeaf }">
        <icon-caret-right class="treeSwitcherIcon" v-if="isLeaf"/>
        <icon-caret-down class="treeSwitcherIcon" v-if="!isLeaf" />
      </template>
      <template #icon="{node}">
        <template v-if="node.iconType===MenuIconTypeEnum.ICON">
          <component :is="node.icon" size="18" style="margin: 0px"></component>
        </template>
        <template v-else-if="node.iconType===MenuIconTypeEnum.ALI">
          <span class="iconfont" :class="node.icon" style="font-size: 15px"></span>
        </template>
        <template v-else-if="node.iconType===MenuIconTypeEnum.IMG">
          <a-image  width="15" :preview="false" :src="node.icon" style="filter: invert(100)"/>
        </template>
      </template>
      <template #title="nodeData">
        <template v-if="!searchKey">{{ nodeData?.name }}</template>
        <template v-else>
          <span v-html="getTitleHtml(nodeData?.name)"></span>
        </template>
      </template>
      <template #extra="nodeData" v-if="!isRolePermission">
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
    <Info ref="infoRef" :menu-data="originListData" @query-menu="getMenus"></Info>
  </div>
</template>
<script lang="ts" setup>
import * as $L from 'owner-tool-js';
import {ref, computed, onMounted, nextTick,watch} from 'vue';
import {getAllMenu, menuDel} from "../../../../common/api/system/menu";
import {ResponseResult, ResponseStatusEnum} from "../../../../common/domain/response";
import Info from './info.vue';
import {dragonConfirm, DragonNotice} from "../../../../common/domain/component";
import {MenuIconTypeEnum} from "../../../../common/domain/enums";

const emit = defineEmits(["selectMenu",'update:selectedKeys']);

const props = defineProps({
  height: {
    type: Number,
    required: true,
    default: 0
  },
  isRolePermission: {
    type: Boolean,
    required: false,
    default: false
  },
  selectedKeys:{
    type: [Array<string|number>],
    required: false,
    default: []
  }
});

/**
 * 监听所选菜单是否发生变化
 * @param
 * @return
 * @author     :loulan
 * */
watch(() => props.selectedKeys,
    (val: any) => {
      emit("update:selectedKeys", val);
    },
    {
      deep: true,
      immediate: false
    }
);

// 添加编辑组件的ref
const infoRef = ref();
// 菜单树的ref
const menuTreeRef = ref();
// 原始树数据
const originTreeData = ref(new Array<any>());
const originListData= ref([]);
// 搜索值
const searchKey = ref();
// 树数据
const treeData = computed(() => {
  if ($L.core.isEmpty(searchKey.value)) {
    nextTick(()=>{
      menuTreeRef.value.expandAll(false);
    })
    return originTreeData.value;
  } else {
    nextTick(()=>{
      // 查询的时候一定要展开节点才能看到查询的内容
      menuTreeRef.value.expandAll(true);
    })
    return searchData(searchKey.value);
  }
})

/**
 * 获取所有菜单信息
 * @param
 * @return
 * @author     :loulan
 * */
const getMenus = ()=>{
  getAllMenu().then((res:ResponseResult) => {
    if (res.status === ResponseStatusEnum.OK && res.data) {
      originListData.value = res.data;
      originTreeData.value = $L.arrayTool.arrayToTree(originListData.value, "id", "pid", -1);
    }
  })
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
      } else if ($L.core.isNotEmpty(item.children)) {
        const filterData: Array<any> = loop(item.children);
        if ($L.core.isNotEmpty(filterData)) {
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
 * 获取搜索时候的和搜索匹配的name展示数据
 * @param
 * @return
 * @author     :loulan
 * */
const getTitleHtml = (name: string) => {
  // 先判断这个name中是否存在这个搜索的数据
  if (name.toLowerCase().includes(searchKey.value.toLowerCase())) {
    // 存在就解析展示这个name
    let index: number = name.toLowerCase().indexOf(searchKey.value.toLowerCase());

    const head = name.substring(0, index);
    const body = name.substring(index, index + searchKey.value.length);
    const foot = name.substring(index + searchKey.value.length);

    return `${head}<span style="color: var(--color-primary-light-4)">${body}</span>${foot}`
  } else {
    // 不存在直接返回name
    return name;
  }
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
    const res:ResponseResult = await menuDel(nodeData.id);
    if (res.status === ResponseStatusEnum.OK) {
      getMenus();
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
  const menuId = selectedKeys[0];
  emit("selectMenu", menuId);
}

onMounted(()=>{
  getMenus();
})

defineExpose({
  /**
   * 获取复选框选中的值
   * @param
   * @return
   * @author     :loulan
   * */
  getCheckedNodes: ()=>{
    return menuTreeRef.value.getCheckedNodes();
  }
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
  height: v-bind(height-40+ 'px');
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
