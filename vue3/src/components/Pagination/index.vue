<script setup lang="ts">
  import { reactive } from 'vue';

  const Page = reactive({
    pageNo: 1,
    limit: 3,
  });

  defineProps({
    total: {
      type: Number,
      required: true,
    },
  });

  const $emit = defineEmits(['change']);
</script>

<template>
  <div>
    <el-pagination
      v-model:current-page="Page.pageNo"
      v-model:page-size="Page.limit"
      :pager-count="5"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @change="$emit('change', Page)"
    />
  </div>
</template>

<style scoped></style>
