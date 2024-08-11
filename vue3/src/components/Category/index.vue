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
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  const $emit = defineEmits<{
    change: [category1Id: number, category2Id: number, category3Id: number];
    clearData: [];
  }>();

  const category1Id = ref<number | undefined>(undefined);
  const category2Id = ref<number | undefined>(undefined);
  const category3Id = ref<number | undefined>(undefined);
  const category1Arr = ref<Category1Types>([]);
  const category2Arr = ref<Category2Types>([]);
  const category3Arr = ref<Category3Types>([]);
  const category1Loading = ref(false);
  const category2Loading = ref(false);
  const category3Loading = ref(false);
  const category1Text = ref<string>('服务器开小差了,  请稍后重试');
  const category2Text = ref<string>('请你先选择一级分类品牌');
  const category3Text = ref<string>('请你先选择一级分类品牌');
  type CategoryCache = Record<number, Category1Types | Category2Types | Category3Types>;
  const categoryCache: CategoryCache = {};

  // 获取一级分类列表数据
  onMounted(async () => {
    try {
      category1Loading.value = true;
      category1Text.value = '加载数据中';
      const result: Category1ResponseData = await reqGetCategory1();
      if (result.code === 200) {
        category1Arr.value = result.data;
        categoryCache[0] = result.data;
        category1Text.value = '请你选择一级分类品牌';
        category2Text.value = '请你先选择一级分类品牌';
        category3Text.value = '请你先选择一级分类品牌';
      } else {
        ElMessage.error('出现问题, 请重试!');
        category1Text.value = '出现问题, 请重试!';
      }
    } catch (e) {
      console.log(e);
      ElMessage.error('服务器开小差了,  请稍后重试');
      category1Text.value = '服务器开小差了,  请稍后重试';
    } finally {
      category1Loading.value = false;
    }
  });
  const category1Changed = async () => {
    try {
      category2Text.value = '加载数据中';
      category3Text.value = '请你先选择二级分类品牌';
      category2Loading.value = true;
      if ((category1Id.value as number) in categoryCache) {
        category2Arr.value = categoryCache[category1Id.value as number] as Category2Types;
        category2Id.value = undefined;
        category3Id.value = undefined;
        // 清除table数据
        $emit('clearData');
        category3Arr.value = [];
        category2Text.value = '请你选择二级分类品牌';
      } else {
        const result: Category2ResponseData = await reqGetCategory2(category1Id.value as number);
        if (result.code === 200) {
          category2Arr.value = result.data;
          categoryCache[category1Id.value as number] = result.data;
          category2Id.value = undefined;
          category3Id.value = undefined;
          category3Arr.value = [];
          category2Text.value = '请你选择二级分类品牌';
        } else {
          ElMessage.error('出现问题, 请重试!');
          category2Text.value = '出现问题, 请重试!';
        }
      }
    } catch (e) {
      console.log(e);
      ElMessage.error('服务器开小差了,  请稍后重试');
      category2Text.value = '服务器开小差了, 请稍后重试';
    } finally {
      category2Loading.value = false;
    }
  };

  const category2Changed = async () => {
    try {
      category2Text.value = '加载数据中';
      category3Text.value = '请你先选择二级分类品牌';
      category3Loading.value = true;
      category3Id.value = undefined;
      // 清除table数据
      $emit('clearData');
      if ((category2Id.value as number) in categoryCache) {
        category3Arr.value = categoryCache[category2Id.value as number] as Category3Types;
        category3Text.value = '请你选择三级分类品牌';
      } else {
        const result: Category3ResponseData = await reqGetCategory3(category2Id.value as number);
        if (result.code === 200) {
          category3Arr.value = result.data;
          categoryCache[category2Id.value as number] = result.data;
          category3Text.value = '请你选择三级分类品牌';
        } else {
          ElMessage.error('出现问题, 请重试!');
          category3Text.value = '出现问题, 请重试!';
        }
      }
    } catch (e) {
      console.log(e);
      ElMessage.error('服务器开小差了,  请稍后重试');
      category3Text.value = '服务器开小差了,  请稍后重试';
    } finally {
      category3Loading.value = false;
    }
  };
</script>

<template>
  <div>
    <el-card class="category_card">
      <el-form inline :disabled="isDisabled">
        <el-form-item label="一级分类">
          <el-select
            v-model="category1Id"
            :placeholder="category1Text"
            :no-data-text="category1Text"
            :loading="category1Loading"
            loading-text="加载数据中"
            @change="category1Changed"
          >
            <el-option
              v-for="category in category1Arr"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="category2Id"
            :placeholder="category2Text"
            :no-data-text="category2Text"
            :loading="category2Loading"
            loading-text="加载数据中"
            @change="category2Changed"
          >
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
            :placeholder="category3Text"
            :no-data-text="category3Text"
            :loading="category3Loading"
            loading-text="加载数据中"
            @change="
              category3Id &&
                $emit('change', category1Id as number, category2Id as number, category3Id as number)
            "
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
