<script setup lang="ts">
  const pageNo = defineModel('pageNo', { type: Number, default: 1 });
  const limit = defineModel('limit', { type: Number, default: 3 });

  defineProps({
    total: {
      type: Number,
      required: true,
    },
  });

  const $emit = defineEmits<{
    change: [currentPage: number, pageSize: number];
  }>();
</script>

<template>
  <div>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :pager-count="5"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      v-bind="$attrs"
      @change="
        (currentPage: number, pageSize: number) => {
          $emit('change', currentPage, pageSize);
        }
      "
    />
  </div>
</template>

<style scoped></style>
