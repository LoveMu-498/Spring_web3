<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import {
    Category1ResponseData,
    Category1Types,
    Category2ResponseData,
    Category2Types,
    Category3ResponseData,
    Category3Types,
  } from '@/api/product/attr/type.ts';
  import { reqGetCategory1, reqGetCategory2, reqGetCategory3 } from '@/api/product/attr/index.ts';
  import { ElMessage } from 'element-plus';

  defineProps({
    category3IdChanged: {
      type: Function,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  const $emit = defineEmits(['change', 'clearData']);

  const category1Id = ref<number | undefined>(undefined);
  const category2Id = ref<number | undefined>(undefined);
  const category3Id = ref<number | undefined>(undefined);

  const category1Arr = ref<Category1Types>([]);
  const category2Arr = ref<Category2Types>([]);
  const category3Arr = ref<Category3Types>([]);
  type CategoryCache = Record<number, Category1Types | Category2Types | Category3Types>;
  const categoryCache: CategoryCache = {};

  onMounted(async () => {
    try {
      const result: Category1ResponseData = await reqGetCategory1();
      if (result.code === 200) {
        category1Arr.value = result.data;
        categoryCache[0] = result.data;
      } else {
        ElMessage.error('出现问题, 请重试!');
      }
    } catch (e) {
      console.log(e);
      ElMessage.error('服务器开小差了,  请稍后重试');
    }
  });
  const category1Changed = async () => {
    try {
      if ((category1Id.value as number) in categoryCache) {
        category2Arr.value = categoryCache[category1Id.value as number] as Category2Types;
        category2Id.value = undefined;
        category3Id.value = undefined;
        // 清除table数据
        $emit('clearData');
        category3Arr.value = [];
      } else {
        const result: Category2ResponseData = await reqGetCategory2(category1Id.value as number);
        if (result.code === 200) {
          category2Arr.value = result.data;
          categoryCache[category1Id.value as number] = result.data;
          category2Id.value = undefined;
          category3Id.value = undefined;
          category3Arr.value = [];
        } else {
          ElMessage.error('出现问题, 请重试!');
        }
      }
    } catch (e) {
      console.log(e);
      ElMessage.error('服务器开小差了,  请稍后重试');
    }
  };

  const category2Changed = async () => {
    try {
      category3Id.value = undefined;
      // 清除table数据
      $emit('clearData');
      if ((category2Id.value as number) in categoryCache) {
        category3Arr.value = categoryCache[category2Id.value as number] as Category3Types;
      } else {
        const result: Category3ResponseData = await reqGetCategory3(category2Id.value as number);
        if (result.code === 200) {
          category3Arr.value = result.data;
          categoryCache[category2Id.value as number] = result.data;
        } else {
          ElMessage.error('出现问题, 请重试!');
        }
      }
    } catch (e) {
      console.log(e);
      ElMessage.error('服务器开小差了,  请稍后重试');
    }
  };
</script>

<template>
  <div>
    <el-card class="category_card">
      <el-form inline>
        <el-form-item label="一级分类">
          <el-select v-model="category1Id" :disabled="isDisabled" @change="category1Changed">
            <el-option
              v-for="category in category1Arr"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="category2Id" :disabled="isDisabled" @change="category2Changed">
            <el-option
              v-for="category in category2Arr"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="category3Id"
            :disabled="isDisabled"
            @change="category3IdChanged(category1Id, category2Id, category3Id)"
          >
            <el-option
              v-for="category in category3Arr"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
  .category_card {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        flex: 1;
        min-width: 200px;
        box-sizing: border-box;
      }
    }
  }
</style>
