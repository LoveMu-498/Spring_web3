<script setup lang="ts">

import {ref} from "vue";
import request from "@/axios/index";

const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles',
}
const tableData = ref(Array.from({ length: 20 }).fill(item))

// request.get('/hello/l').then(res => {
//   console.log(res)
// })

request.post("/hello/listPage", {
  nickName: "小明",
  pageNum: 1,
  pageSize: 4,
}).then(res => {
  console.log(res)
})


</script>

<template>
  <el-scrollbar>
    <el-table :data="tableData">
      <el-table-column prop="date" label="Date" width="140" />
      <el-table-column prop="name" label="Name" width="120" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </el-scrollbar>
</template>

<style scoped>
.el-main {
  padding: 0;
}
</style>