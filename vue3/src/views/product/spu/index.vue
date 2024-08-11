<script setup lang="ts">
  import Category from '@/components/Category/index.vue';
  import Pagination from '@/components/Pagination/index.vue';
  import SkuForm from '@/views/product/spu/skuForm.vue';
  import SpuForm from '@/views/product/spu/spuForm.vue';
  import { nextTick, ref } from 'vue';
  import { SpuInfo, SpuInfoList, SpuResponseData } from '@/api/product/spu/type.ts';
  import { reqDeleteSpu, reqGetSpuList } from '@/api/product/spu/index.ts';
  import { ElMessage } from 'element-plus';
  import { SkuInfoList, SkuListResponseData } from '@/api/product/sku/type.ts';
  import { reqSkuListBySpuId } from '@/api/product/sku/index.ts';

  const pageNo = ref<number>(1);
  const limit = ref<number>(3);
  // 场景标识 0 为 SPU展示 1:修改SPU 2:增加SKU
  const scene = ref<number>(0);
  const total = ref<number>(5);
  const spuList = ref<SpuInfoList>([]);
  const category3Id = ref<number | undefined>(undefined);
  const spuLoading = ref<boolean>(false);
  const spuFormRef = ref<InstanceType<typeof SpuForm> | null>(null);
  const skuFormRef = ref<InstanceType<typeof SkuForm> | null>(null);

  const flushSpuTable = async () => {
    try {
      spuLoading.value = true;
      const result: SpuResponseData = await reqGetSpuList(pageNo.value, limit.value, {
        category3Id: category3Id.value,
      } as SpuInfo);
      if (result.code === 200) {
        const { data } = result;
        // TODO flushSpuTable后 接下来的赋值会触发 Pagination 的 @change ,从而再次触发 flushData, 可能vue机制并没有循环触发
        // TODO 研究vue数据触发机制?
        total.value = data.total;
        pageNo.value = data.current;
        spuList.value = data.records;
      }
    } catch (e) {
      console.log('flush', e);
      ElMessage.error('服务器开小差了, 请刷新重试');
    } finally {
      spuLoading.value = false;
    }
  };

  // 事实上 ,原则在spu的部分 category2Id 是不会改变的
  const clearData = () => {
    // category2Id 的值不关键, 只有 category3Id的值有效时, 才需要考虑category2Id的值
    category3Id.value = undefined;
    spuList.value = [];
    pageNo.value = 1;
    limit.value = 3;
    total.value = 0;
  };

  const updatePage = () => {
    // 使用了 v-model 不需要使用参数了
    // pageNo.value = page.pageNo;
    // limit.value = page.limit;
    flushSpuTable();
  };

  const removeSpu = async (id: number) => {
    try {
      const result = await reqDeleteSpu(id);
      if (result.code === 200) {
        ElMessage.success('SPU删除成功');
        await flushSpuTable();
      }
    } catch (e) {
      console.log('removeSpu', e);
      ElMessage.error('SPU删除失败');
    }
  };

  const addSpuInfo = () => {
    scene.value = 1;
  };

  const cancelSpuForm = () => {
    flushSpuTable();
    scene.value = 0;
  };

  const editSpuInfo = async (spuId: number) => {
    try {
      const spuInfoRes = await spuFormRef.value!.initSpuInfo(spuId);
      if (spuInfoRes.code !== 200) {
        console.log(spuInfoRes, spuInfoRes.message);
      }
      scene.value = 1;
    } catch (error) {
      console.log(error);
      ElMessage.error('获取SPU信息失败,请重试');
    }
  };

  const skuListVisible = ref<boolean>(false);
  const skuList = ref<SkuInfoList>([]);

  const showSkuList = async (spuId: number) => {
    try {
      const result: SkuListResponseData = await reqSkuListBySpuId(spuId);
      console.log(result);
      if (result.code === 200) {
        skuList.value = result.data;
        skuListVisible.value = true;
      }
    } catch (e) {
      console.log('showSkuList', e);
      ElMessage.error('SKU列表获取失败');
    }
  };

  const skuListDialogClosed = () => {
    skuList.value = [];
  };

  const addSku = (spu: SpuInfo) => {
    skuFormRef.value!.initSkuInfo(spu.id!, spu.tmId!);
    scene.value = 2;
  };

  const cancelSkuForm = () => {
    // flushSpuTable();
    scene.value = 0;
  };

  const category3IdChanged = (id1: number, id2: number, id3: number) => {
    console.log('category3IdChanged', id1, id2, id3);
    category3Id.value = id3;
    spuFormRef.value!.getTmList(category3Id.value!);
    skuFormRef.value!.getSkuAttrList(id1, id2, id3);
    console.log('category3Id.Changed');
    flushSpuTable();
  };
</script>

<template>
  <div>
    <Category :is-disabled="scene !== 0" @clear-data="clearData" @change="category3IdChanged" />
    <el-card>
      <div v-show="scene === 0" v-loading="spuLoading" class="spu_show">
        <el-button @click="pageNo = 2">测试按钮</el-button>
        <el-button type="primary" icon="Plus" :disabled="!category3Id" @click="addSpuInfo">
          添加SPU
        </el-button>
        <el-table :data="spuList" border>
          <el-table-column type="index" align="center" label="序号"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="primary" size="small" icon="Plus" @click="addSku(row)" />
              <el-button type="warning" size="small" icon="Edit" @click="editSpuInfo(row.id)" />
              <el-button type="info" size="small" icon="InfoFilled" @click="showSkuList(row.id)" />

              <el-popconfirm
                :title="`是否删除的${row.spuName}`"
                width="200px"
                @confirm="removeSpu(row.id)"
              >
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          v-model:page-no="pageNo"
          v-model="limit"
          :total="total"
          :disabled="!category3Id"
          @change="updatePage"
        />
      </div>
      <SpuForm v-show="scene === 1" ref="spuFormRef" @cancel-spu-form="cancelSpuForm" />
      <SkuForm v-show="scene === 2" ref="skuFormRef" @cancel-sku-form="cancelSkuForm" />
    </el-card>
    <el-dialog
      v-model="skuListVisible"
      title="SKU列表"
      width="500"
      align-center
      @close="skuListDialogClosed"
    >
      <el-table :data="skuList" border>
        <el-table-column label="SKU名字">
          <template #default="{ row }">
            <el-tooltip :content="row.skuDesc" placement="top">
              {{ row.skuName }}
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="SKU价格" prop="price"></el-table-column>
        <el-table-column label="SKU重量" prop="weight"></el-table-column>
        <el-table-column label="SKU图片">
          <template #default="{ row }">
            <img :src="row.skuDefaultImg" :alt="row.skuName" style="height: 100px; width: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
  .el-card {
    margin: 10px 0;

    .spu_show {
      .el-btn {
        margin: 10px 0;
      }
      .el-table {
        margin: 10px 0;
      }
    }

    .spu_edit {
      .el-image {
        width: 100px;
        height: 100px;
      }
      .uploader-icon {
        width: 100px;
        height: 100px;
        :hover {
          cursor: pointer;
          background: #2a598a;
        }
      }
      .el-tag {
        margin-right: 5px;
        margin-bottom: 5px;
      }
      .button-new-tag {
        :hover {
          color: var(--el-button-hover-text-color);
          border-color: var(--el-button-hover-border-color);
          background-color: var(--el-button-hover-bg-color);
          outline: none;
        }
      }
    }
  }
</style>
