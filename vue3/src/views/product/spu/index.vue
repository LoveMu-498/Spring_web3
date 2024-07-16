<script setup lang="ts">
  import Category from '@/components/Category/index.vue';
  import Pagination from '@/components/Pagination/index.vue';
  import { ref, reactive, onMounted, computed, nextTick } from 'vue';
  import {
    BaseSaleAttrList,
    SpuImageType,
    SpuInfo,
    SpuInfoList,
    SpuResponseData,
    SpuSaleAttr,
    SpuSaleAttrs,
  } from '@/api/product/spu/type.ts';
  import {
    reqAddOrUpdateSpu,
    reqBaseSaleAttrList,
    reqDeleteSpu,
    reqGetSpuInfo,
    reqGetSpuList,
  } from '@/api/product/spu/index.ts';
  import { reqFindTrademarkList } from '@/api/product/baseCategoryTrademark/index.ts';
  import { TradeMarkList } from '@/api/product/trademark/type.ts';
  import { ElMessage, UploadFile, UploadProps } from 'element-plus';
  import { UploadResponseData } from '@/api/product/upload/type.ts';
  import {
    SkuAttrValueType,
    SkuImageType,
    SkuImageTypes,
    SkuInfo,
    SkuInfoList,
    SkuListResponseData,
    SkuSaleAttrValueType,
  } from '@/api/product/sku/type.ts';
  import {
    reqSaveSkuInfo,
    reqSkuListBySpuId,
    reqSpuImageList,
    reqSpuSaleAttrList,
  } from '@/api/product/sku/index.ts';
  import { reqGetAttribute } from '@/api/product/attr/index.ts';
  import { AttributeTypes } from '@/api/product/attr/type.ts';

  const pageNo = ref<number>(1);
  const limit = ref<number>(3);
  // 场景标识 0 为 SPU展示 1:修改SPU 2:增加SKU
  const scene = ref<number>(0);
  const total = ref<number>(5);
  const spuList = ref<SpuInfoList>([]);
  const spuInfo = reactive<SpuInfo>({
    category3Id: undefined,
    spuImageList: [],
    spuPosterList: [],
    spuSaleAttrList: [],
    description: undefined,
    id: undefined,
    spuName: undefined,
    tmId: undefined,
  });

  const validateImageList = (rule: any, value: any, callback: any) => {
    if (value.length === 0) {
      return callback(new Error('至少需要上传一个图片'));
    }
    return callback();
  };

  const validateAttrList = (rule: any, value: any, callback: any) => {
    if (value.length === 0) {
      return callback(new Error('至少需要一个销售属性, 请通过选择框+按钮添加'));
    }
    if (value.length > new Set(value).size) {
      return callback(new Error('销售属性不允许重复'));
    }
    return callback();
  };

  const validateAttrValueList = (rule: any, value: any, callback: any) => {
    if (value.length === 0) {
      return callback(new Error('至少需要一个销售属性值'));
    }
    if (value.length > new Set(value).size) {
      return callback(new Error('销售属性值不允许重复'));
    }
    return callback();
  };

  const spuLoading = ref<boolean>(false);
  const saveLoading = ref<boolean>(false);
  const spuInfoRules = reactive({
    spuName: [
      { required: true, message: 'Please input spuName', trigger: 'blur' },
      { min: 2, max: 10, message: 'tmName should be 2 to 10', trigger: 'blur' },
    ],
    tmId: [{ required: true, message: 'Please choose tmId', trigger: 'blur' }],
    description: [
      { required: true, message: 'Please input description', trigger: 'blur' },
      { min: 2, max: 100, message: 'tmName should be 2 to 100', trigger: 'blur' },
    ],
    spuImageList: [{ required: true, validator: validateImageList, trigger: 'change' }],
    spuSaleAttrList: [{ required: true, validator: validateAttrList, trigger: 'blur' }],
  });
  const spuInfoFormRef = ref<any>(null);
  const trademarkList = ref<TradeMarkList>([]);
  const baseAttrList = ref<BaseSaleAttrList>([]);
  const baseAttributeId = ref<number>(undefined);

  const flushSpuTable = async () => {
    try {
      spuLoading.value = true;
      const result: SpuResponseData = await reqGetSpuList(pageNo.value, limit.value, {
        category3Id: spuInfo.category3Id,
      });
      if (result.code === 200) {
        const { data } = result;
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

  const getTmList = async () => {
    try {
      const result = await reqFindTrademarkList(spuInfo.category3Id);
      if (result.code === 200) {
        trademarkList.value = result.data;
      }
    } catch (error) {
      console.error('getTmList:', error);
      ElMessage.error('获取品牌列表失败');
    }
  };

  const getBaseSaleAttrList = async () => {
    try {
      const result = await reqBaseSaleAttrList();
      if (result.code === 200) {
        baseAttrList.value = result.data;
      }
    } catch (error) {
      console.error('获取基本销售属性失败:', error);
    }
  };

  onMounted(() => {
    getBaseSaleAttrList();
  });

  const clearData = () => {
    console.log('clear data');
  };

  const updatePage = (page: any) => {
    pageNo.value = page.pageNo;
    limit.value = page.limit;
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

  const removeAttr = (index: number) => {
    spuInfo.spuSaleAttrList.splice(index, 1);
    spuInfoFormRef.value.validateField('spuSaleAttrList');

    ElMessage.success('Attr删除成功');
  };

  const removeAttrValue = (attrIndex: number, attrValueIndex: number) => {
    spuInfo.spuSaleAttrList[attrIndex].spuSaleAttrValueList.splice(attrValueIndex, 1);
    spuInfoFormRef.value.validateField(`spuSaleAttrList.${attrIndex}.spuSaleAttrValueList`);
    ElMessage.success('AttrValue删除成功');
  };

  // eslint-disable-next-line no-return-assign
  const addSpuInfo = () => (scene.value = 1);

  const editSpuInfo = async (spuId: number) => {
    try {
      const result = await reqGetSpuInfo(spuId);
      if (result.code === 200) {
        Object.assign(spuInfo, JSON.parse(JSON.stringify(result.data)));
      }
      scene.value = 1;
    } catch (error) {
      console.log(error);
      ElMessage.error('获取SPU信息失败,请重试');
    }
  };

  const tmChanged = () => {
    spuInfoFormRef.value.validateField('tmId');
  };

  const dialogImageUrl = ref('');
  const dialogVisible = ref(false);
  const fileList = computed({
    get: () =>
      spuInfo.spuImageList.map(item => ({
        uid: item.id?.toString(),
        name: item.imgName,
        url: item.imgUrl,
        status: 'success',
      })),
    set: () => {},
  });
  const handleRemove: UploadProps['onRemove'] = uploadFile => {
    const index = spuInfo.spuImageList.findIndex(
      item => item.imgUrl === uploadFile.url && item.imgName === uploadFile.name
    );
    if (index !== -1) spuInfo.spuImageList.splice(index, 1);
    spuInfoFormRef.value.validateField('spuImageList');
  };

  const handlePictureCardPreview: UploadProps['onPreview'] = uploadFile => {
    dialogImageUrl.value = uploadFile.url!;
    dialogVisible.value = true;
  };

  const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response: UploadResponseData,
    uploadFile: UploadFile
    // uploadFiles: UploadFiles
  ) => {
    // console.log('files', uploadFiles);
    spuInfo.spuImageList.push({
      imgName: uploadFile.name,
      imgUrl: response.data,
      spuId: spuInfo.id,
    });
    spuInfoFormRef.value.clearValidate('spuImageList');
    // 清除表单图片的校验提示信息
    // trademarkFormRef.value.clearValidate('logoUrl');
  };

  const handleAvatarError: UploadProps['onError'] = () => {
    ElMessage.error('上传失败, 请重试');
  };

  const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(rawFile.type)) {
      ElMessage.error('Avatar picture must be JPG|PNG|GIF format!');
      return false;
    }
    if (rawFile.size / 1024 / 1024 > 4) {
      ElMessage.error('Avatar picture size can not exceed 4MB!');
      return false;
    }
    return true;
  };

  const addAttr = () => {
    if (!spuInfo.spuSaleAttrList.some(attr => attr.baseSaleAttrId === baseAttributeId.value)) {
      spuInfo.spuSaleAttrList.push({
        baseSaleAttrId: baseAttributeId.value,
        saleAttrName: baseAttrList.value.find(attr => attr.id === baseAttributeId.value).name,
        spuId: spuInfo.id,
        spuSaleAttrValueList: [],
      });
      spuInfoFormRef.value.clearValidate('spuSaleAttrList');
      baseAttributeId.value = undefined;
    }
  };

  const toShow = (attr: SpuSaleAttr, index: number) => {
    if (
      attr.newTagValue &&
      !attr.spuSaleAttrValueList.some(
        attrValue => attr.newTagValue.trim() === attrValue.saleAttrValueName
      )
    ) {
      attr.spuSaleAttrValueList.push({
        id: undefined,
        baseSaleAttrId: attr.baseSaleAttrId,
        // isChecked: boolean,
        saleAttrName: attr.saleAttrName,
        saleAttrValueName: attr.newTagValue.trim(),
        spuId: attr.spuId,
      });
    }
    spuInfoFormRef.value.validateField(`spuSaleAttrList.${index}.spuSaleAttrValueList`);

    // eslint-disable-next-line no-param-reassign
    attr.newTagFlag = false;
    // eslint-disable-next-line no-param-reassign
    attr.newTagValue = '';
  };

  const toEdit = (attr: SpuSaleAttr) => {
    // eslint-disable-next-line no-param-reassign
    attr.newTagFlag = true;
  };

  const cancelSpuInfo = () => {
    scene.value = 0;
    Object.assign(spuInfo, {
      spuImageList: [],
      spuPosterList: [],
      spuSaleAttrList: [],
      description: undefined,
      id: undefined,
      spuName: undefined,
      tmId: undefined,
    });
    baseAttributeId.value = undefined;
    dialogVisible.value = false;
    dialogImageUrl.value = '';
    spuInfoFormRef.value.clearValidate();
    flushSpuTable();
  };

  const addOrUpdateSpuInfo = async () => {
    try {
      await spuInfoFormRef.value.validate();
      saveLoading.value = true;
      const result = await reqAddOrUpdateSpu(spuInfo);
      console.log(result);
      if (result.code === 200) {
        ElMessage.success(spuInfo.id ? '修改成功' : '保存成功');
        cancelSpuInfo();
      }
    } catch (e) {
      console.log(e);
      ElMessage.error(spuInfo.id ? '修改失败' : '保存失败!');
    } finally {
      saveLoading.value = false;
    }
  };

  const vFocus = {
    mounted: (el: any) => {
      const inputElement = el.querySelector('input');
      if (inputElement) {
        inputElement.focus();
      }
    },
  };

  // 我认为 sku添加 需要封组件? 把相关变量 放一块吧
  const skuLoading = ref<boolean>(false);
  const skuInfo = reactive<SkuInfo>({
    id: undefined,
    spuId: undefined,
    price: undefined,
    skuName: '',
    skuDesc: '',
    weight: undefined,
    tmId: undefined,
    category3Id: undefined,
    skuDefaultImg: '',
    isSale: undefined,
    skuImageList: [],
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
  });
  const validateSkuAttrValue = (rules: any, value: SkuAttrValueType, callback: any) => {
    if (!value || !value?.valueId) {
      return callback(new Error(`请选择${value ? value.attrName : '平台属性'}`));
    }
    return callback();
  };
  const validateSkuImageList = (rules: any, value: SkuImageTypes, callback: any) => {
    if (!value || value.length === 0) {
      return callback(new Error('至少选择一个图像'));
    }
    if (!value?.some(item => item.isDefault)) {
      return callback(new Error('必须要有默认图像'));
    }
    return callback();
  };
  const skuInfoRules = reactive({
    skuName: [
      { required: true, message: 'Please input skuName', trigger: 'blur' },
      { min: 2, max: 10, message: 'skuName should be 2 to 10', trigger: 'blur' },
    ],
    price: [
      { required: true, message: 'Please input skuPrice', trigger: 'blur' },
      { type: 'number', min: 0, message: 'price must be greater than 0', trigger: 'blur' },
    ],
    weight: [
      { required: true, message: 'Please input skuWeight', trigger: 'blur' },
      { type: 'number', min: 0, message: 'weight must be greater than 0', trigger: 'blur' },
    ],
    skuDesc: [
      { required: true, message: 'Please input skuDesc', trigger: 'blur' },
      { min: 2, max: 100, message: 'skuDesc should be 2 to 100', trigger: 'blur' },
    ],
    skuImageList: [{ required: true, validator: validateSkuImageList, trigger: 'blur' }],
  });
  const skuInfoFormRef = ref<any>(null);
  const spuSaleAttrList = ref<SpuSaleAttrs>([]);
  const skuAllImageList = ref<SkuImageTypes>([]);
  const imgTableRef = ref<any>(null);
  const skuAttrList = ref<AttributeTypes>([]);
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

  const getAttrList = async (id1: number, id2: number, id3: number) => {
    try {
      const result = await reqGetAttribute(id1, id2, id3);
      if (result.code === 200) {
        skuAttrList.value = result.data;
      }
    } catch (e) {
      console.log('getAttrList', e);
      ElMessage.error('获取品牌属性失败');
    }
  };

  const addSku = async (spu: SpuInfo) => {
    scene.value = 2;
    skuInfo.spuId = spu.id;
    skuInfo.tmId = spu.tmId;
    // skuInfo.category3Id // 在 category3Changed 函数中 设置
    try {
      const attrResult = await reqSpuSaleAttrList(skuInfo.spuId);
      console.log('att', attrResult);
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
          // 测试, 如果 在修改时, skuInfo有相同url的选项 则使用该id
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
            imgTableRef.value.clearSelection();
            await nextTick();
            selectionImages.forEach(selectedImg =>
              imgTableRef.value.toggleRowSelection(selectedImg, true)
            );
          }
        }
      }
    } catch (e) {
      console.log(e);
      ElMessage.error('获取SPU数据失败, 请重试');
    }
  };

  // 默认 row参数为 skuAllImageList 中的元素, 注意其地址相同
  // rows  vue @select调用(测试证明有同一个对象row,地址相同)
  const tableRowSelected = (newSelection: SkuImageTypes) => {
    const defaultSelection = skuAllImageList.value.find(item => item.isDefault);
    if (defaultSelection && !newSelection.includes(defaultSelection)) {
      defaultSelection.isDefault = false;
    }
    skuInfo.skuImageList = JSON.parse(JSON.stringify(newSelection));
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
      imgTableRef.value.toggleRowSelection(row, true);
      // // skuInfo不包含, 则rows包含row的 方式 调用 tableRowSelected ,以期望包含进去
      // if (!skuInfo.skuImageList.some(item => item.imgUrl === row.imgUrl)) {
      //   tableRowSelected([...skuInfo.skuImageList, row]);
      // }
    }
    skuInfoFormRef.value.validateField('skuImageList');
  };

  const tableRowClick = (row: SkuImageType) => {
    imgTableRef.value.toggleRowSelection(row);
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
      isSale: undefined,
      skuImageList: [],
      skuAttrValueList: [],
      skuSaleAttrValueList: [],
    });
    spuSaleAttrList.value = [];
    skuAllImageList.value = [];
    skuInfoFormRef.value.clearValidate();
    scene.value = 0;
    flushSpuTable();
  };

  const saveSkuInfo = async () => {
    try {
      await skuInfoFormRef.value.validate();
      skuLoading.value = true;
      const result = await reqSaveSkuInfo(skuInfo);
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

  const category3IdChanged = (id1: number, id2: number, id3: number) => {
    console.log(id1, id2, id3);
    spuInfo.category3Id = id3;
    skuInfo.category3Id = id3;
    flushSpuTable();
    getTmList();
    getAttrList(id1, id2, id3);
  };
</script>

<template>
  <div>
    <Category
      :category3IdChanged="category3IdChanged"
      :is-disabled="scene !== 0"
      @clear-data="clearData()"
    />
    <el-card>
      <div v-show="scene === 0" v-loading="spuLoading" class="spu_show">
        <el-button type="primary" icon="Plus" :disabled="!spuInfo.category3Id" @click="addSpuInfo">
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

              <el-popconfirm :title="`是否删除的${row.spuName}`" @confirm="removeSpu(row.id)">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :total="total" @change="updatePage" />
      </div>
      <div
        v-show="scene === 1"
        v-loading="saveLoading"
        class="spu_edit"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="loading..."
      >
        <el-form ref="spuInfoFormRef" :model="spuInfo" :rules="spuInfoRules" label-width="120px">
          <el-form-item label="SPU名称" prop="spuName">
            <el-input v-model="spuInfo.spuName"></el-input>
          </el-form-item>
          <el-form-item label="SPU品牌" prop="tmId">
            <el-select v-model="spuInfo.tmId" @change="tmChanged">
              <el-option
                v-for="trademark in trademarkList"
                :key="trademark.id"
                :label="trademark.tmName"
                :value="trademark.id!"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="SPU描述" prop="description">
            <el-input v-model="spuInfo.description" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="SPU照片" prop="spuImageList">
            <el-upload
              v-model:file-list="fileList"
              action="/api/admin/product/fileUpload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleAvatarSuccess"
              :on-error="handleAvatarError"
              :before-upload="beforeAvatarUpload"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
              <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
          </el-form-item>
          <el-form-item label="SPU销售属性" prop="spuSaleAttrList">
            <el-select
              v-model="baseAttributeId"
              :validate-event="false"
              no-data-text="请选择要添加的基础属性"
              style="flex: 1; margin-right: 10px"
            >
              <el-option
                v-for="baseAttr in baseAttrList"
                :key="baseAttr.id"
                :value="baseAttr.id"
                :label="baseAttr.name"
                :disabled="
                  spuInfo.spuSaleAttrList.some(attr => attr.baseSaleAttrId === baseAttr.id)
                "
              />
            </el-select>
            <el-button type="primary" icon="Plus" :disabled="!baseAttributeId" @click="addAttr"
              >添加销售属性</el-button
            >
            <el-table border :data="spuInfo.spuSaleAttrList" style="margin: 10px 0">
              <el-table-column label="序号" type="index" align="center"></el-table-column>
              <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
              <el-table-column label="属性值">
                <template #default="{ row, $index }">
                  <el-form-item
                    :prop="`spuSaleAttrList.${$index}.spuSaleAttrValueList`"
                    :rules="{ required: true, validator: validateAttrValueList, trigger: 'blur' }"
                    :inline-message="true"
                  >
                    <el-tag
                      v-for="(attrValue, index) in row.spuSaleAttrValueList"
                      :key="attrValue.id"
                      size="small"
                      closable
                      @close="removeAttrValue($index, index)"
                    >
                      {{ attrValue.saleAttrValueName }}
                    </el-tag>
                    <el-input
                      v-if="row.newTagFlag"
                      v-model="row.newTagValue"
                      v-focus
                      class="w-20"
                      size="small"
                      @keyup.enter="toShow(row, $index)"
                      @blur="toShow(row, $index)"
                    />
                    <el-button v-else class="button-new-tag" size="small" @click="toEdit(row)">
                      添加新的属性值
                    </el-button>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="{ row, $index }">
                  <el-popconfirm
                    :title="`是否删除的${row.saleAttrName}`"
                    @confirm="removeAttr($index)"
                  >
                    <template #reference>
                      <el-button type="danger" size="small" icon="Delete" />
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="addOrUpdateSpuInfo">保存</el-button>
        <el-button @click="cancelSpuInfo">取消</el-button>
      </div>
      <div v-show="scene === 2" v-loading="skuLoading" class="sku_show">
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
                :rules="{ required: true, validator: validateSkuAttrValue, trigger: 'change' }"
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
                required: true,
                validator: (rules: any, value: SkuSaleAttrValueType, callback: any) => {
                  if (!value?.saleAttrValueId) {
                    return callback(new Error(''));
                  }
                  return callback();
                },
                trigger: 'blur',
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
                  <img :src="row.imgUrl" :alt="row.imgName" />
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
            <img :src="row.skuDefaultImg" :alt="row.skuName" />
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
