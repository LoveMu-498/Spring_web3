<script setup lang="ts">
  import useUserStore from '@/store/modules/user.ts';
  import { ref, onMounted } from 'vue';

  const userStore = useUserStore();
  const pageNo = ref<number>(1);
  const limit = ref<number>(3);
</script>

<template>
  <el-card class="box-card">
    <!-- 卡片顶部添加按钮 -->
    <el-button type="primary" size="default" icon="Plus">添加品牌</el-button>
    <el-table border>
      <el-table-column align="center" width="80px" label="序号"></el-table-column>
      <el-table-column label="品牌名称"></el-table-column>
      <el-table-column label="品牌LOGO"></el-table-column>
      <el-table-column label="品牌操作"></el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="400"
    />
  </el-card>
</template>

<style scoped lang="scss">
  .el-table {
    margin: 10px;
  }
</style>
