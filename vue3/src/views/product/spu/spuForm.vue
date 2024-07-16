<script setup lang="ts"></script>

<template>
  <div class="spu_edit">
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
            :disabled="spuInfo.spuSaleAttrList.some(attr => attr.baseSaleAttrId === baseAttr.id)"
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
              <el-popconfirm :title="`是否删除的${row.saleAttrName}`" @confirm="removeAttr($index)">
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
