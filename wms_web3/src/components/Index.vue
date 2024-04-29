<template>
  <el-container class="layout-container-demo" style="height: 500px">
    <el-aside :width="asideWidth + 'px'" style="height: 100%">
      <Aside :collapseFlag="flag"/>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <Header :toggleCollapse="toggleCollapse"/>
      </el-header>

      <el-main>
        <Main />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Aside from "@/components/Aside.vue";
import Header from "@/components/Hearder.vue";
import Main from "@/components/Main.vue";

const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles',
}
const tableData = ref(Array.from({ length: 20 }).fill(item))

let asideWidth = ref(200);

const flag = ref(false);
const toggleCollapse = (collapseFlag:boolean) => {
  asideWidth.value = collapseFlag ? 64 : 200;
  flag.value = collapseFlag;
}
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
