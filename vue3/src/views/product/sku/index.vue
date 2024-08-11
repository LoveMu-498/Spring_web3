<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { SkuInfo, SkuInfoList, SkuResponseData } from '@/api/product/sku/type.ts';
  import {
    reqCancelSale,
    reqOnSale,
    reqSkuInfoList,
    reqRemoveSkuInfo,
    reqGetSkuInfoBySkuId,
  } from '@/api/product/sku/index.ts';
  import { ElMessage } from 'element-plus';

  const pageNo = ref<number>(1);
  const limit = ref<number>(3);
  const total = ref<number>(0);
  const skuInfoList = ref<SkuInfoList>([]);
  const drawerFlag = ref<boolean>(false);
  const skuInfo = reactive<SkuInfo>({} as SkuInfo);

  const flushTable = async () => {
    const result = await reqSkuInfoList(pageNo.value, limit.value);
    if (result.code === 200) {
      const { data } = result;
      skuInfoList.value = data.records;
      total.value = data.total;
      limit.value = data.size;
      pageNo.value = data.current;
    }
  };

  const pageChanged = async () => flushTable();

  onMounted(() => flushTable());

  const onOrCancelSale = async (skuId: number, isSale: boolean) => {
    let result;
    if (isSale) {
      result = await reqCancelSale(skuId);
    } else {
      result = await reqOnSale(skuId);
    }
    if (result.code === 200) {
      ElMessage.success(`商品${isSale ? '下架' : '上架'}成功`);
      await flushTable();
    }
  };

  const editSkuInfo = (skuId: number) => {
    console.log('skuId = ', skuId);
    ElMessage.info('程序员还在偷懒, 此功能未完善, 敬请期待');
  };

  const showSkuInfo = async (skuId: number) => {
    const result: SkuResponseData = await reqGetSkuInfoBySkuId(skuId);
    if (result.code === 200) {
      Object.assign(skuInfo, result.data);
    }
    // const result1 = await
    drawerFlag.value = true;
  };

  const cancelDrawer = () => {
    drawerFlag.value = false;
  };

  const confirmDrawer = () => {
    cancelDrawer();
  };

  const deleteSkuInfo = async (skuId: number) => {
    const result = await reqRemoveSkuInfo(skuId);
    if (result.code === 200) {
      ElMessage.success('商品删除成功');
      await flushTable();
    } else {
      ElMessage.error('删除失败, 请稍后重试');
    }
  };
</script>

<template>
  <el-card>
    <el-table border :data="skuInfoList" width="100%" max-height="800px" style="margin: 10px 0">
      <el-table-column label="序号" type="index" width="60px" />
      <el-table-column label="名称" prop="skuName" width="150px" show-overflow-tooltip />
      <el-table-column label="描述" prop="skuDesc" show-overflow-tooltip />
      <el-table-column label="默认图片" width="124px">
        <template #default="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt="商品默认图片"
            style="width: 100px; height: 100px; margin: auto"
          />
        </template>
      </el-table-column>
      <el-table-column label="重量(g)" prop="weight" width="150px" />
      <el-table-column label="价格(元)" prop="price" width="150px" />
      <el-table-column label="操作" fixed="right" width="205px">
        <template #default="{ row }">
          <el-button
            :type="row.isSale ? 'info' : 'success'"
            size="small"
            :icon="row.isSale ? 'Bottom' : 'Top'"
            @click="onOrCancelSale(row.id, row.isSale)"
          />
          <el-button type="primary" size="small" icon="Edit" @click="editSkuInfo(row.id)" />
          <el-button type="info" size="small" icon="InfoFilled" @click="showSkuInfo(row.id)" />
          <el-popconfirm :title="`确定删除${row.skuName}吗?`" @confirm="deleteSkuInfo(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete" />
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:pageNo="pageNo"
      v-model:limit="limit"
      :total="total"
      @change="pageChanged"
    />
    <el-drawer v-model="drawerFlag">
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <template #default>
        <el-row>
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              v-for="attr in skuInfo.skuAttrValueList"
              :key="attr.id"
              type="danger"
              size="small"
            >
              {{ attr.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              v-for="saleAttr in skuInfo.skuSaleAttrValueList"
              :key="saleAttr.id"
              type="info"
              size="small"
            >
              {{ saleAttr.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel
              :interval="4000"
              type="card"
              height="200px"
              arrow="always"
              indicator-position="outside"
            >
              <el-carousel-item v-for="skuImage in skuInfo.skuImageList" :key="skuImage.id">
                <img :src="skuImage.imgUrl" :alt="skuImage.imgName" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelDrawer">cancel</el-button>
          <el-button type="primary" @click="confirmDrawer">confirm</el-button>
        </div>
      </template>
    </el-drawer>
  </el-card>
</template>

<style scoped lang="scss">
  .el-table {
    max-height: calc(100vh - $base-bar-height - 100px);
  }
  .el-row > .el-col {
    margin: 10px 0;

    .el-tag {
      margin: 5px;
    }

    .el-carousel__item img {
      opacity: 0.75;
      line-height: 200px;
      margin: 0;
      text-align: center;
    }

    .el-carousel__item > img {
      width: 100%;
      height: 100%;
    }
  }
</style>
