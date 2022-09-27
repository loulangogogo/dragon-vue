<template>
  <div class="queryDiv">
    <a-row>
      <a-col :span="20">
        <a-input-search v-model="searchKey"/>
      </a-col>
      <a-col :span="4">
        <div align="right">
          <a-button type="primary" status="success">添加</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
  <div class="treeDiv">
    <a-tree block-node :data="treeData">
      <template #title="nodeData">
        <template v-if="!searchKey">{{ nodeData?.title }}</template>
        <template v-else>
          <span v-html="getTitleHtml(nodeData?.title)"></span>
        </template>
      </template>
      <template #extra="nodeData">
        <a-space align="center">
          <div class="treeNodeOperateIconDiv" align="center">
            <icon-edit class="treeNodeOperateIcon" style="color: blue"/>
          </div>
          <div class="treeNodeOperateIconDiv" align="center">
            <icon-delete class="treeNodeOperateIcon" style="color: red"/>
          </div>
        </a-space>
      </template>
    </a-tree>
  </div>
</template>
<script lang="ts" setup>
import {ref, computed} from 'vue';
import * as $L from 'owner-tool-js';

const props = defineProps({
  height: {
    type: Number,
    required: true,
    default: 0
  }
});

// 原始树数据
const originTreeData = [
  {
    title: 'Trunk 0-0',
    key: '0-0',
    children: [
      {
        title: 'Branch 0-0-1',
        key: '0-0-1',
        children: [
          {
            title: 'Leaf 0-0-1-1',
            key: '0-0-1-1'
          },
          {
            title: 'Leaf 0-0-1-2',
            key: '0-0-1-2'
          }
        ]
      },
    ],
  },
  {
    title: 'Trunk 0-1',
    key: '0-1',
    children: [
      {
        title: 'Branch 0-1-1',
        key: '0-1-1',
        children: [
          {
            title: 'Leaf 0-1-1-0',
            key: '0-1-1-0',
          }
        ]
      },
      {
        title: 'Branch 0-1-2',
        key: '0-1-2',
        children: [
          {
            title: 'Leaf 0-1-2-0',
            key: '0-1-2-0',
          }
        ]
      },
    ],
  },
];
// 搜索值
const searchKey = ref();
// 树数据
const treeData = computed(() => {
  if ($L.core.isEmpty(searchKey.value)) {
    return originTreeData;
  } else {
    return searchData(searchKey.value);
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
      if (item.title.toLowerCase().includes(keyword.toLowerCase())) {
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

  return loop(originTreeData);
}

/**
 * 获取搜索时候的和搜索匹配的title展示数据
 * @param
 * @return
 * @author     :loulan
 * */
const getTitleHtml = (title: string) => {
  // 先判断这个title中是否存在这个搜索的数据
  if (title.toLowerCase().includes(searchKey.value.toLowerCase())) {
    // 存在就解析展示这个title
    let index: number = title.toLowerCase().indexOf(searchKey.value.toLowerCase());

    const head = title.substring(0, index);
    const body = title.substring(index, index + searchKey.value.length);
    const foot = title.substring(index + searchKey.value.length);

    return `${head}<span style="color: var(--color-primary-light-4)">${body}</span>${foot}`
  } else {
    // 不存在直接返回title
    return title;
  }
}

/**
 * 点击添加按钮的时候
 * @param
 * @return
 * @author     :loulan
 * */
const add = () => {

}

/**
 * 点击编辑按钮的时候
 * @param
 * @return
 * @author     :loulan
 * */
const edit = (nodeData: any) => {

}

/**
 * 点击删除按钮的时候
 * @param
 * @return
 * @author     :loulan
 * */
const del = (nodeData: any) => {

}
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
</style>
