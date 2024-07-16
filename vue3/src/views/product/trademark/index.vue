<script setup lang="ts">
  import { ref, onMounted, reactive } from 'vue';
  import type { Reactive } from 'vue';
  import {
    reqHasTrademark,
    reqRemoveTrademark,
    reqAddOrUpdateTrademark,
  } from '@/api/product/trademark/index.ts';
  import {
    TradeMarkList,
    ResponseData,
    TradeMark,
    TradeMarkResponseData,
  } from '@/api/product/trademark/type.ts';
  import { ElMessage, UploadProps } from 'element-plus';
  import { UploadResponseData } from '@/api/product/upload/type.ts';
  import Pagination from '@/components/Pagination/index.vue';

  let pageNo = 1;
  let limit = 3;
  const total = ref<number>(0);
  const trademarkArr = ref<TradeMarkList>([]);
  const dialogFormVisible = ref(false);
  const dialogTitle = ref<string>('');
  const uploading = ref<boolean>(false);
  const uploadText = ref<string>('');
  const uploadRef = ref<any>(null);
  const trademarkFormRef = ref<any>(null);
  const trademarkParams: Reactive<TradeMark> = reactive({
    tmName: '',
    logoUrl: '',
  });

  // 表单校验规则
  const rules = reactive({
    tmName: [
      { required: true, message: 'Please input username', trigger: 'blur' },
      { min: 2, max: 10, message: 'tmName should be 2 to 10', trigger: 'blur' },
    ],
    logoUrl: [
      { required: true, message: 'Please select LOGO', trigger: 'blur' },
      {
        pattern: /^[http:].*$/,
        message: 'logoUrl must begin at http:',
        trigger: 'blur',
      },
    ],
  });

  // 获取已有品牌接口封装函数
  const getHasTrademark = async () => {
    const result: TradeMarkResponseData = await reqHasTrademark(pageNo, limit);
    if (result.code === 200) {
      total.value = result.data.total;
      trademarkArr.value = result.data.records;
    }
    console.log(result);
  };

  const updatePage = (page: any) => {
    pageNo = page.pageNo;
    limit = page.limit;
    getHasTrademark();
  };

  onMounted(() => {
    getHasTrademark();
  });

  const addTrademark = () => {
    trademarkParams.id = undefined;
    trademarkParams.tmName = '';
    trademarkParams.logoUrl = '';
    dialogTitle.value = '增加品牌';
    dialogFormVisible.value = true;
  };
  const updateTrademark = (data: any) => {
    Object.assign(trademarkParams, data);
    dialogTitle.value = '修改品牌';
    dialogFormVisible.value = true;
  };

  const removeTrademark = async (id: number) => {
    const result = await reqRemoveTrademark(id);
    if (result.code === 200) {
      ElMessage.success('已成功删除');
      await getHasTrademark();
    } else {
      ElMessage.error('删除失败, 请重试');
    }
    console.log(result);
  };

  const confirm = async () => {
    // 通过 try catch ,使表单校验不成功后阻止后续代码执行, 故catch 为空
    try {
      await trademarkFormRef.value.validate();
      const result: ResponseData = await reqAddOrUpdateTrademark(trademarkParams);
      if (result.code === 200) {
        ElMessage.success(trademarkParams.id ? '修改品牌成功' : '添加品牌成功');
        await getHasTrademark();
      } else {
        ElMessage.error(trademarkParams.id ? '修改品牌失败' : '添加品牌失败');
      }
      dialogFormVisible.value = false;
      console.log(result);
    } catch (e) {
      /* empty */
    }
  };

  let interval: any = null;

  function showFakeLoading() {
    console.log(133);
    uploading.value = true;
    if (interval) clearInterval(interval);
    let count = 0;
    const texts = ['加载中...', '加载中.', '加载中..'];
    interval = setInterval(() => {
      if (uploading.value) {
        uploadText.value = texts[count % texts.length];
        count += 1;
      }
    }, 1000);
  }
  function hideFakeLoading() {
    uploading.value = false;
    if (interval) clearInterval(interval);
    uploadText.value = '';
  }
  // 阻止并取消上传文件
  const abortUpload = () => {
    if (uploadRef.value && uploading.value) {
      uploadRef.value.abort();
      hideFakeLoading();
    }
  };

  const cancel = () => {
    dialogFormVisible.value = false;
    abortUpload();
    // 将所有表单校验验证信息去除
    trademarkFormRef.value.clearValidate(Object.keys(rules));
  };

  const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response: UploadResponseData
    // uploadFile: UploadFile,
    // uploadFiles: UploadFiles
  ) => {
    hideFakeLoading();
    console.log('res', response);
    // console.log('file', uploadFile);
    // console.log('files', uploadFiles);
    trademarkParams.logoUrl = response.data;
    // 清除表单图片的校验提示信息
    trademarkFormRef.value.clearValidate('logoUrl');
  };

  const handleAvatarError: UploadProps['onError'] = () => {
    hideFakeLoading();
    ElMessage.error('上传失败, 请重试');
  };
  //
  const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(rawFile.type)) {
      ElMessage.error('Avatar picture must be JPG|PNG|GIF format!');
      return false;
    }
    if (rawFile.size / 1024 / 1024 > 4) {
      ElMessage.error('Avatar picture size can not exceed 4MB!');
      return false;
    }
    showFakeLoading();
    return true;
  };
</script>

<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部添加按钮 -->
      <el-button type="primary" size="default" icon="Plus" @click="addTrademark"
        >添加品牌</el-button
      >
      <el-table :data="trademarkArr" border>
        <el-table-column type="index" align="center" width="80px" label="序号"></el-table-column>
        <el-table-column prop="tmName" label="品牌名称"></el-table-column>
        <el-table-column label="品牌LOGO">
          <template #default="{ row }">
            <img
              :src="/^[http:]/.test(row.logoUrl) ? row.logoUrl : `http://${row.logoUrl}`"
              :alt="row.tmName"
              class="logoImg"
            />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)" />
            <el-popconfirm
              :title="`你确定删除该商品(${row.tmName})么?`"
              width="250px"
              icon="Delete"
              @confirm="removeTrademark(row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete" />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!--      <el-pagination-->
      <!--        v-model:current-page="pageNo"-->
      <!--        v-model:page-size="limit"-->
      <!--        :pager-count="5"-->
      <!--        :page-sizes="[3, 5, 7, 9]"-->
      <!--        :background="true"-->
      <!--        layout="prev, pager, next, jumper, ->, sizes, total"-->
      <!--        :total="total"-->
      <!--        @change="getHasTrademark()"-->
      <!--      />-->
      <Pagination :total="total" @change="updatePage" />
    </el-card>
    <!-- title: 设置对话框左上角标题-->
    <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="500" draggable>
      <el-form ref="trademarkFormRef" class="dialog-form" :model="trademarkParams" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="trademarkParams.tmName" placeholder="请输入要添加的品牌名称" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- action 上传图片的请求地址 -->
          <div
            v-loading="uploading"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :element-loading-text="uploadText"
          >
            <el-upload
              ref="uploadRef"
              class="avatar-uploader"
              action="/api/admin/product/fileUpload"
              drag
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :on-error="handleAvatarError"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="trademarkParams.logoUrl"
                :src="
                  /^[http:]/.test(trademarkParams.logoUrl)
                    ? trademarkParams.logoUrl
                    : `http://${trademarkParams.logoUrl}`
                "
                class="avatar"
                :alt="trademarkParams.tmName"
              />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <template v-if="uploading">
          <el-popconfirm title="图片还未上传成功, 是否取消上传" @confirm="abortUpload">
            <template #reference>
              <el-button type="primary" size="default"> 取消 </el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm title="图片还未上传成功, 是否取消上传并重试" @confirm="abortUpload">
            <template #reference>
              <el-button type="primary" size="default"> 确定 </el-button>
            </template>
          </el-popconfirm>
        </template>
        <template v-else>
          <el-button type="primary" size="default" @click="cancel"> 取消 </el-button>
          <el-button type="primary" size="default" @click="confirm"> 确定 </el-button>
        </template>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
  .el-table {
    margin: 10px;

    .logoImg {
      width: 100px;
      height: 100px;
    }
  }
  .dialog-form {
    width: 80%;
  }
</style>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
</style>
<style scoped>
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
