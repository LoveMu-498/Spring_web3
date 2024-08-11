<script setup lang="ts">
  import { nextTick, onMounted, reactive, ref } from 'vue';
  import {
    BaseSaleAttrList,
    SpuImageType,
    SpuImageTypes,
    SpuInfo,
    SpuInfoResponseData,
    SpuPosterTypes,
    SpuSaleAttr,
    SpuSaleAttrs,
    SpuSaleAttrValue,
    SpuSaleAttrValues,
  } from '@/api/product/spu/type.ts';
  import { TradeMarkList, TradeMarkListResponseData } from '@/api/product/trademark/type.ts';
  import { reqFindTrademarkList } from '@/api/product/baseCategoryTrademark/index.ts';
  import { ElMessage, FormRules, UploadFile, UploadProps, UploadUserFile } from 'element-plus';
  import { UploadResponseData } from '@/api/product/upload/type.ts';
  import {
    reqAddOrUpdateSpu,
    reqBaseSaleAttrList,
    reqGetSpuInfo,
  } from '@/api/product/spu/index.ts';
  import type { TransformTypes } from '@/utils/transformType.ts';

  type TypeSpuInfo = TransformTypes<SpuInfo, ['spuImageList', 'spuPosterList', 'spuSaleAttrList']>;

  const spuInfo = reactive<TypeSpuInfo>({
    category3Id: undefined,
    spuImageList: [] as SpuImageTypes,
    spuPosterList: [] as SpuPosterTypes,
    spuSaleAttrList: [] as SpuSaleAttrs,
    description: '',
    id: undefined,
    spuName: undefined,
    tmId: undefined,
  });

  const $emit = defineEmits(['cancelSpuForm']);

  const saveLoading = ref<boolean>(false);
  const trademarkList = ref<TradeMarkList>([]);
  const spuInfoFormRef = ref<any>(null);
  const baseAttrList = ref<BaseSaleAttrList>([]);
  const baseAttributeObjStr = ref<string>('');

  const spuInfoRules = reactive<FormRules<SpuInfo>>({
    spuName: [
      { required: true, message: 'Please input spuName', trigger: 'blur' },
      { min: 2, max: 10, message: 'tmName should be 2 to 10', trigger: 'blur' },
    ],
    tmId: [{ required: true, message: 'Please choose tmId', trigger: 'blur' }],
    description: [
      { required: true, message: 'Please input description', trigger: 'blur' },
      { min: 2, max: 100, message: 'tmName should be 2 to 100', trigger: 'blur' },
    ],
    // spuImageList: [{ required: true, validator: validateImageList, trigger: 'change' }],
    spuImageList: [
      { required: true, type: 'array', min: 1, message: '至少上传一个图片', trigger: 'blur' },
    ],
    spuSaleAttrList: [
      // { required: true, validator: validateAttrList, trigger: 'blur' },
      {
        required: true,
        min: 1,
        type: 'array',
        message: '至少需要一个销售属性',
      },
    ],
  });

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

  const getTmList = async (category3Id: number): Promise<TradeMarkListResponseData> => {
    try {
      spuInfo.category3Id = category3Id;
      const result = await reqFindTrademarkList(spuInfo.category3Id);
      if (result.code === 200) {
        trademarkList.value = result.data;
      }
      return result;
    } catch (error) {
      console.error('getTmList:', error);
      ElMessage.error('获取品牌列表失败');
    }
    return {
      code: 500,
      message: 'no reason',
      ok: false,
    } as TradeMarkListResponseData;
  };

  const dialogImageUrl = ref('');
  const dialogVisible = ref(false);
  const handleRemove: UploadProps['onRemove'] = () => {
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
    console.log('files', uploadFile, response);
    Object.assign(spuInfo.spuImageList[spuInfo.spuImageList.length - 1], {
      imgName: spuInfo.spuImageList[spuInfo.spuImageList.length - 1].name!,
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
    if (baseAttributeObjStr.value) {
      // 当 split 函数中使用正则表达式 且 正则表达式中有捕获组时, 其中捕获组也会作为结果保留下来, 该正则表达式捕获了第一个冒号后面所有内容(因为默认贪婪模式)
      // 因此 原则上不怕name中包含: 使表达式返回不止两个值使name收集不全
      const [baseSaleAttrIdStr, saleAttrName] = baseAttributeObjStr.value.split('\\:(.+)\\');
      const baseSaleAttrId = parseInt(baseSaleAttrIdStr, 10);
      spuInfo.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuId: spuInfo.id,
        spuSaleAttrValueList: [] as SpuSaleAttrValues,
      });
      spuInfoFormRef.value.clearValidate('spuSaleAttrList');
      baseAttributeObjStr.value = '';
    }
  };

  const toShow = (attr: SpuSaleAttr, index: number) => {
    if (
      attr.newTagValue &&
      !attr.spuSaleAttrValueList.some(
        attrValue => attr.newTagValue!.trim() === attrValue.saleAttrValueName
      )
    ) {
      attr.spuSaleAttrValueList.push({
        baseSaleAttrId: attr.baseSaleAttrId,
        // TODO about SpuInfo.spuSaleAttrValueList.isChecked
        // isChecked: boolean,
        saleAttrName: attr.saleAttrName,
        saleAttrValueName: attr.newTagValue.trim(),
        spuId: attr.spuId,
      } as SpuSaleAttrValue);
    } else {
      ElMessage.error(`属性值不能为空或重复`);
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
    Object.assign(spuInfo, {
      spuImageList: [] as SpuImageTypes,
      spuPosterList: [] as SpuPosterTypes,
      spuSaleAttrList: [] as SpuSaleAttrs,
      description: undefined,
      id: undefined,
      spuName: undefined,
      tmId: undefined,
    });
    baseAttributeObjStr.value = '';
    dialogVisible.value = false;
    dialogImageUrl.value = '';
    spuInfoFormRef.value.clearValidate();
    $emit('cancelSpuForm');
  };

  const addOrUpdateSpuInfo = async () => {
    try {
      await spuInfoFormRef.value.validate();
      saveLoading.value = true;
      const result = await reqAddOrUpdateSpu(spuInfo as SpuInfo);
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

  const vFocus = {
    mounted: (el: any) => {
      const inputElement = el.querySelector('input');
      if (inputElement) {
        inputElement.focus();
      }
    },
  };

  const initSpuInfo = async (spuId: number): Promise<SpuInfoResponseData> => {
    try {
      const result = await reqGetSpuInfo(spuId);
      if (result.code === 200) {
        Object.assign(spuInfo, JSON.parse(JSON.stringify(result.data)));
      }
      spuInfo.spuImageList = spuInfo.spuImageList.map((item: SpuImageType) => ({
        ...item,
        name: item.imgName!,
        url: item.imgUrl!,
      }));
      return result;
    } catch (e) {
      console.log(e);
      ElMessage.error('获取SPU信息失败,请重试');
    }
    return {
      code: 500,
      message: 'no reason',
      ok: false,
    } as SpuInfoResponseData;
  };

  defineExpose({
    getTmList,
    initSpuInfo,
  });
</script>

<template>
  <div
    v-loading="saveLoading"
    class="spu_edit"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    element-loading-text="loading..."
  >
    <el-form ref="spuInfoFormRef" :model="spuInfo" :rules="spuInfoRules" label-width="    ">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input v-model="spuInfo.spuName" placeholder="请你输入SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="SPU品牌" prop="tmId">
        <el-select v-model="spuInfo.tmId" no-data-text="请你选择SPU品牌">
          <el-option
            v-for="trademark in trademarkList"
            :key="trademark.id"
            :label="trademark.tmName"
            :value="trademark.id!"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" prop="description">
        <el-input
          v-model="spuInfo.description"
          type="textarea"
          placeholder="请你输入SPU描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU照片" prop="spuImageList">
        <el-upload
          v-model:file-list="spuInfo.spuImageList as UploadUserFile[]"
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
          <img :src="dialogImageUrl" alt="Preview Image" style="width: 300px; height: 300px" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="SPU销售属性" prop="spuSaleAttrList">
        <el-select
          v-model="baseAttributeObjStr"
          :validate-event="false"
          :placeholder="
            spuInfo.spuSaleAttrList.length === baseAttrList.length
              ? '暂无SPU销售属性可添加'
              : '请选择要添加的基础属性'
          "
          :disabled="spuInfo.spuSaleAttrList.length === baseAttrList.length"
          style="flex: 1; margin-right: 10px"
        >
          <el-option
            v-for="baseAttr in baseAttrList"
            :key="baseAttr.id"
            :value="`${baseAttr.id}:${baseAttr.name}`"
            :label="baseAttr.name"
            :disabled="spuInfo.spuSaleAttrList.some(attr => attr.baseSaleAttrId === baseAttr.id)"
          />
        </el-select>
        <el-button type="primary" icon="Plus" :disabled="!baseAttributeObjStr" @click="addAttr"
          >添加销售属性</el-button
        >
        <el-table border :data="spuInfo.spuSaleAttrList" style="margin: 10px 0">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名" prop="saleAttrName" width="120px"></el-table-column>
          <el-table-column label="属性值">
            <template #default="{ row, $index }">
              <el-form-item
                :prop="`spuSaleAttrList.${$index}.spuSaleAttrValueList`"
                :rules="{
                  required: true,
                  min: 1,
                  type: 'array',
                  message: '至少需要一个销售属性值',
                  trigger: 'blur',
                }"
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
                  class="input-new-tag"
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
          <el-table-column label="操作" width="120px  ">
            <template #default="{ row, $index }">
              <el-popconfirm :title="`是否删除的${row.saleAttrName}`" @confirm="removeAttr($index)">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpuInfo">保存</el-button>
        <el-button @click="cancelSpuInfo">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
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
    .input-new-tag {
      width: 100px;
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
</style>
