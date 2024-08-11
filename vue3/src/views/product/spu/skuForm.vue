<script setup lang="ts">
  import {
    ResponseData,
    SkuAttrValueType,
    SkuAttrValueTypes,
    SkuImageType,
    SkuImageTypes,
    SkuInfo,
    SkuSaleAttrValueTypes,
  } from '@/api/product/sku/type.ts';
  import { nextTick, reactive, ref } from 'vue';
  import { reqSaveSkuInfo, reqSpuImageList, reqSpuSaleAttrList } from '@/api/product/sku/index.ts';
  import { ElForm, ElMessage, ElTable, FormRules } from 'element-plus';
  import { reqGetAttribute } from '@/api/product/attr/index.ts';
  import { SpuImageType, SpuSaleAttrs } from '@/api/product/spu/type.ts';
  import { AttributeResponseData, AttributeTypes } from '@/api/product/attr/type.ts';
  import type { TransformTypes } from '@/utils/transformType.ts';

  // 事实证明 使用 withDefaults 真是简单又轻松
  type partSkuInfo = TransformTypes<
    SkuInfo,
    ['skuImageList', 'skuAttrValueList', 'skuSaleAttrValueList']
  >;

  const skuInfo = reactive<partSkuInfo>({
    id: undefined,
    spuId: undefined,
    price: undefined,
    skuName: '',
    skuDesc: '',
    weight: undefined,
    tmId: undefined,
    category3Id: undefined,
    skuDefaultImg: '',
    // 商品上架情况 默认未上架
    isSale: 0,
    skuImageList: [] as SkuImageTypes,
    skuAttrValueList: [] as SkuAttrValueTypes,
    skuSaleAttrValueList: [] as SkuSaleAttrValueTypes,
  });

  const $emit = defineEmits(['cancelSkuForm']);

  // 我认为 sku添加 需要封组件? 把相关变量 放一块吧
  const skuLoading = ref<boolean>(false);
  const skuInfoFormRef = ref<any>(null);
  const spuSaleAttrList = ref<SpuSaleAttrs>([]);
  const skuAllImageList = ref<SkuImageTypes>([]);
  const imgTableRef = ref<InstanceType<typeof ElTable> | null>(null);
  const skuAttrList = ref<AttributeTypes>([]);
  const isFirstValid = ref<boolean>(true);
  const validateSkuAttrValue = (_rules: any, value: SkuAttrValueType, callback: any) => {
    if (!value || !value?.valueId) {
      callback(new Error());
    }
    callback();
  };
  const validateSkuImageList = (_rules: any, value: SkuImageTypes, callback: any) => {
    try {
      if (!value || value.length === 0) {
        callback(new Error('至少选择一个图像'));
      }
      if (value && !value.some(item => item.isDefault)) {
        callback(new Error('必须要有默认图像'));
      }
    } catch (e) {
      console.log('Test.ValidateSkuImageList', e);
      callback();
    }
    callback();
  };

  // const onValidate = (prop: FormItemProp, isValid: boolean, message: string) => {
  //   // console.log('onValidate', prop, isValid, message, typeof prop);
  //   if (!isValid) {
  //     if (isFirstValid.value) {
  //       skuInfoFormRef.value.scrollToField(prop);
  //       isFirstValid.value = false;
  //     }
  //   }
  // };

  // TODO 貌似 console.info 是没有办法了 ,尽量解决掉error
  const skuInfoRules = reactive<FormRules<SkuInfo>>({
    skuName: [
      { required: true, message: 'Please input skuName', trigger: 'blur' },
      { min: 2, max: 10, message: 'skuName should be 2 to 10', trigger: 'blur' },
    ],
    price: [
      { required: true, message: 'Please input skuPrice', trigger: 'blur' },
      { type: 'number', min: 0, message: 'price must be and greater than 0', trigger: 'blur' },
    ],
    weight: [
      { required: true, message: 'Please input skuWeight', trigger: 'blur' },
      { type: 'number', min: 0, message: 'weight must be greater than 0', trigger: 'blur' },
    ],
    skuDesc: [
      { required: true, message: 'Please input skuDesc', trigger: 'blur' },
      { min: 2, max: 100, message: 'skuDesc should be 2 to 100', trigger: 'blur' },
    ],
    skuImageList: [{ validator: validateSkuImageList, trigger: 'blur' }],
  });

  const getSkuAttrList = async (
    category1Id: number,
    category2Id: number,
    category3Id: number
  ): Promise<AttributeResponseData> => {
    try {
      skuInfo.category3Id = category3Id;
      const result = await reqGetAttribute(
        category1Id as number,
        category2Id as number,
        category3Id as number
      );
      if (result.code === 200) {
        skuAttrList.value = result.data;
      }
      // attrStopWatch();
    } catch (e) {
      console.log('getAttrList', e);
      ElMessage.error('获取品牌属性失败');
    }
    return {} as AttributeResponseData;
  };

  const initSkuInfo = async (spuId: number, tmId: number): Promise<ResponseData> => {
    // skuInfo.category3Id // 在 category3Changed 函数中 设置
    try {
      skuInfo.spuId = spuId;
      skuInfo.tmId = tmId;
      const attrResult = await reqSpuSaleAttrList(skuInfo.spuId);
      if (attrResult.code === 200) {
        spuSaleAttrList.value = attrResult.data;
        // skuInfo.skuAttrValueList = spuSaleAttrList.value.map(item => ({
        //   attrId: item.id,
        //   attrName: item.saleAttrName,
        //   spuId: item.spuId,
        // }));
      }
      const imgResult = await reqSpuImageList(skuInfo.spuId);
      if (imgResult.code === 200) {
        skuAllImageList.value = imgResult.data.map((spuImg: SpuImageType) => ({
          // 测试, 如果 在修改时, skuInfo有相同url的选项 则使用该id 事实上本项目没有修改需求 故取消TODO
          id: skuInfo.skuImageList.find(skuImg => skuImg.imgUrl === spuImg.imgUrl)?.id,
          imgName: spuImg.imgName,
          imgUrl: spuImg.imgUrl,
          isDefault: spuImg.imgUrl === skuInfo.skuDefaultImg,
          skuId: skuInfo.id,
          spuImgId: spuImg.id,
        }));
        // 考虑修改情况 ,已经有 defaultImg , 故一定要清空选项,然后选择url相同的一项 (注意 nextTick的应用)
        // 事实上考虑修改 只需确保 两个 isDefault 对的, 剩余ref选择框 一起计算
        if (skuInfo.skuImageList.length > 0) {
          const selectionImages = skuAllImageList.value.filter(item =>
            skuInfo.skuImageList.some(it => item.imgUrl === it.imgUrl)
          );
          console.log('selection', selectionImages);
          if (selectionImages.length > 0) {
            await nextTick();
            imgTableRef.value!.clearSelection();
            await nextTick();
            selectionImages.forEach(selectedImg =>
              imgTableRef.value!.toggleRowSelection(selectedImg, true)
            );
          }
        }
      }

      // spuIdStopWatch();
    } catch (e) {
      console.log(e);
      ElMessage.error('获取SPU数据失败, 请重试');
    }
    return {} as ResponseData;
  };

  // watch(
  //   () => spuId,
  //   () => addSku()
  // );

  // 默认 row参数为 skuAllImageList 中的元素, 注意其地址相同
  // rows  vue @select调用(测试证明有同一个对象row,地址相同)
  const tableRowSelected = (newSelection: SkuImageTypes) => {
    const defaultSelection = skuAllImageList.value.find(item => item.isDefault);
    if (defaultSelection && !newSelection.includes(defaultSelection)) {
      defaultSelection.isDefault = false;
    }
    skuInfo.skuImageList = JSON.parse(JSON.stringify(newSelection));
    isFirstValid.value = true;
    skuInfoFormRef.value.validateField('skuImageList');
  };

  const setDefault = (row: SkuImageType) => {
    // 已经是默认的情况 则必然是被选择的状态, 只需调整默认情况即可
    if (row.isDefault) {
      skuInfo.skuDefaultImg = '';
      // eslint-disable-next-line no-param-reassign
      row.isDefault = false;
      skuInfo.skuImageList.find(item => item.imgUrl === row.imgUrl)!.isDefault = false;
      // tableRowSelected(skuInfo.skuImageList, skuImg);
    } else {
      // 先全部置为 非默认
      // eslint-disable-next-line no-param-reassign
      skuAllImageList.value.forEach(item => {
        // eslint-disable-next-line no-param-reassign
        item.isDefault = false;
      });
      skuInfo.skuDefaultImg = row.imgUrl;
      // eslint-disable-next-line no-param-reassign
      row.isDefault = true;
      skuInfo.skuImageList.forEach(item => {
        // eslint-disable-next-line no-param-reassign
        item.isDefault = item.imgUrl === row.imgUrl;
      });
      // 但是 通过 ref 选择 会触发 selection-change 便不用主动触发
      // 通过 ref 选择 似乎不会触发 @select, 选择主动触发
      imgTableRef.value!.toggleRowSelection(row, true);
      // // skuInfo不包含, 则rows包含row的 方式 调用 tableRowSelected ,以期望包含进去
      // if (!skuInfo.skuImageList.some(item => item.imgUrl === row.imgUrl)) {
      //   tableRowSelected([...skuInfo.skuImageList, row]);
      // }
    }
    isFirstValid.value = true;
    skuInfoFormRef.value.validateField('skuImageList');
  };

  const tableRowClick = (row: SkuImageType) => {
    (imgTableRef.value! as any).toggleRowSelection(row);
  };

  const cancelSkuInfo = () => {
    Object.assign(skuInfo, {
      id: undefined,
      spuId: undefined,
      price: undefined,
      skuName: '',
      skuDesc: '',
      weight: undefined,
      tmId: undefined,
      // 由 三级option 决定和改变
      // category3Id: undefined,
      skuDefaultImg: '',
      isSale: 0,
      skuImageList: [] as SkuImageTypes,
      skuAttrValueList: [] as SkuAttrValueTypes,
      skuSaleAttrValueList: [] as SkuSaleAttrValueTypes,
    });
    spuSaleAttrList.value = [];
    skuAllImageList.value = [];
    skuInfoFormRef.value.clearValidate();
    $emit('cancelSkuForm');
  };

  const saveSkuInfo = async () => {
    try {
      isFirstValid.value = true;
      await skuInfoFormRef.value.validate();
      skuLoading.value = true;
      const result = await reqSaveSkuInfo(skuInfo as SkuInfo);
      console.log(result);
      if (result.code === 200) {
        ElMessage.success(skuInfo.id ? 'sku修改成功' : 'sku保存成功');
        cancelSkuInfo();
      }
    } catch (e) {
      ElMessage.error(skuInfo.id ? 'sku修改失败' : 'sku保存失败');
    } finally {
      skuLoading.value = false;
    }
  };

  defineExpose({ initSkuInfo, getSkuAttrList });
</script>

<template>
  <div v-loading="skuLoading" class="sku_show">
    <el-form ref="skuInfoFormRef" :model="skuInfo" :rules="skuInfoRules">
      <el-form-item label="SKU名称" prop="skuName">
        <el-input v-model="skuInfo.skuName" property="SKU名称" placeholder="请输入SKU名称" />
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input
          v-model.number="skuInfo.price"
          type="number"
          property="价格(元)"
          placeholder="请输入价格(元)"
        />
      </el-form-item>
      <el-form-item label="重量(克)" prop="weight">
        <el-input
          v-model.number="skuInfo.weight"
          type="number"
          property="重量(克)"
          placeholder="请输入重量(克)"
        />
      </el-form-item>
      <el-form-item label="SKU描述" prop="skuDesc">
        <el-input
          v-model="skuInfo.skuDesc"
          type="textarea"
          property="SKU描述"
          placeholder="请输入SKU描述"
        />
      </el-form-item>
      <el-form-item label="平台属性">
        <div style="display: flex; flex-wrap: wrap-reverse">
          <el-form-item
            v-for="(attr, index) in skuAttrList"
            :key="attr.id"
            :label="attr.attrName"
            style="box-sizing: border-box; margin-bottom: 10px; flex: 1 0; min-width: 200px"
            label-width="80px"
            :prop="`skuAttrValueList.${index}`"
            :rules="{
              required: true,
              validator: validateSkuAttrValue,
              message: `请选择${attr.attrName}`,
              trigger: 'change',
            }"
            :show-message="false"
          >
            <el-select
              v-model="skuInfo.skuAttrValueList[index]"
              :placeholder="`请选择${attr.attrName}`"
              value-key="valueId"
            >
              <el-option
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="{
                  id: skuInfo.skuAttrValueList.find((item: SkuAttrValueType) => {
                    item?.valueId && item.valueId === attrValue.id;
                  })?.id,
                  attrId: attr.id,
                  attrName: attr.attrName,
                  skuId: skuInfo.id,
                  valueId: attrValue.id,
                  valueName: attrValue.valueName,
                }"
              ></el-option>
            </el-select>
            <!--              <template #error="{ error: string }"> </template>-->
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="销售属性" prop="skuSaleAttrValueList">
        <el-form-item
          v-for="(attr, index) in spuSaleAttrList"
          :key="attr.id"
          :inline-message="true"
          :label="attr.saleAttrName"
          style="flex: 1 0 30%; margin-right: 10px"
          :prop="`skuSaleAttrValueList.${index}`"
          :rules="{
            required: true, // stop
            message: `请选择${attr.saleAttrName}`,
            trigger: 'change',
          }"
          :show-message="false"
        >
          <el-select
            v-model="skuInfo.skuSaleAttrValueList[index]"
            value-key="saleAttrValueId"
            :placeholder="`请选择对应${attr.saleAttrName}`"
          >
            <el-option
              v-for="attrValue in attr.spuSaleAttrValueList"
              :key="attrValue.id"
              :label="attrValue.saleAttrValueName"
              :value="{
                id: skuInfo.skuSaleAttrValueList.find(
                  item => item.saleAttrValueId && item.saleAttrValueId === attrValue.id
                )?.id,
                saleAttrValueId: attrValue.id,
                saleAttrValueName: attrValue.saleAttrValueName,
                saleAttrId: attr.id,
                saleAttrName: attrValue.saleAttrName,
                skuId: skuInfo.id,
                spuId: skuInfo.spuId,
              }"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="图片名称" prop="skuImageList">
        <el-table
          ref="imgTableRef"
          :data="skuAllImageList"
          style="width: 100%"
          border
          @selection-change="tableRowSelected"
          @row-click="tableRowClick"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column lable="图片">
            <template #default="{ row }">
              <img :src="row.imgUrl" :alt="row.imgName" width="100px" height="100px" />
            </template>
          </el-table-column>
          <el-table-column lable="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button
                :type="row.isDefault ? 'success' : 'warning'"
                @click.stop="setDefault(row)"
              >
                设置默认</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-button type="primary" @click="saveSkuInfo"> 保存 </el-button>
      <el-button @click="cancelSkuInfo">取消</el-button>
    </el-form>
  </div>
</template>

<style scoped></style>
