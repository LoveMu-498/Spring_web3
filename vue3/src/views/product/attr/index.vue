<script setup lang="ts">
  import { ref, reactive, nextTick, ComponentPublicInstance } from 'vue';
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { cloneDeep } from 'lodash-es';
  import Category from '@/components/Category/index.vue';
  import {
    reqGetAttribute,
    reqSaveAttrInfo,
    reqDeleteAttrByAttrId,
  } from '@/api/product/attr/index.ts';
  import {
    AttributeResponseData,
    AttributeType,
    AttributeTypes,
    AttributeValueType,
    ResponseData,
  } from '@/api/product/attr/type.ts';
  import { ElMessage, FormRules } from 'element-plus';

  // 场景展示 值
  const scene = ref<number>(0);
  const attrArr = ref<AttributeTypes>([]);
  const loading = ref(false);
  const loadingText = ref<string>('');
  const btnDisabled = ref(true);
  const tagTypes = ['primary', 'info', 'success'];
  const attribute = reactive<AttributeType>({
    id: undefined,
    attrName: '',
    categoryId: 0,
    categoryLevel: 0,
    attrValueList: [],
  });
  const addAttrFormRef = ref();
  const rules = reactive<FormRules>({
    attrName: [{ required: true, message: 'Please input attrName', trigger: 'blur' }],
  });
  let id1: number = 0;
  let id2: number = 0;
  let id3: number = 0;
  // 用于判断是否为刚刚渲染 只有在一个inputRef销毁时,flag置真, 后续渲染往后触发focus,随即置假,保证只执行一次
  // const inputRefFlag = ref<boolean>(true);

  const addAttr = () => {
    scene.value = 1;
  };
  //
  // let originAttr: AttributeType = {
  //   attrName: '',
  //   categoryId: 0,
  //   categoryLevel: 0,
  //   attrValueList: [],
  // };

  const updateAttr = (originAttr: AttributeType) => {
    Object.assign(attribute, cloneDeep<AttributeType>(originAttr));
    // attribute.attrValueList = attribute.attrValueList.map((attr: AttributeValueType) => ({
    //   ...attr,
    //   flag: true,
    // }));
    console.log('attribute', attribute);
    scene.value = 1;
  };

  const cancel = () => {
    Object.assign(
      attribute,
      cloneDeep<AttributeType>({
        attrName: '',
        categoryId: attribute.categoryId,
        categoryLevel: attribute.categoryLevel,
        attrValueList: [],
        id: undefined,
      })
    );
    // Object.assign(attribute, cloneDeep<AttributeType>(originAttr));
    console.log('attribute', attribute);
    scene.value = 0;
  };

  const clearData = () => {
    btnDisabled.value = true;
    attrArr.value = [];
  };

  const flushDate = async () => {
    try {
      loading.value = true;
      loadingText.value = '加载数据中, 请稍等';
      const result: AttributeResponseData = await reqGetAttribute(id1, id2, id3);
      if (result.code === 200) {
        attrArr.value = result.data;
        btnDisabled.value = false;
      }
      console.log(result);
    } catch (e) {
      console.log(e);
      ElMessage.error('服务器开小差了,  请刷新重试');
      clearData();
    } finally {
      loading.value = false;
    }
  };

  const addAttrValue = async () => {
    try {
      loading.value = true;
      loadingText.value = '添加属性值中...';
      await addAttrFormRef.value.validate();
      attribute.attrValueList.push({
        valueName: '',
        flag: true,
      });
      // 确保 DOM 渲染完毕
    } catch (e) {
      console.log('e', e);
      ElMessage.error('表单填写错误');
    } finally {
      loading.value = false;
    }
  };

  const deleteAttrValue = (index: number) => {
    attribute.attrValueList.splice(index, 1);
  };

  const category3Changed = async (
    category1Id: number,
    category2Id: number,
    category3Id: number
  ) => {
    id1 = category1Id;
    id2 = category2Id;
    id3 = category3Id;
    await flushDate();
  };

  const saveAttr = async () => {
    try {
      // console.log(attribute.attrValueList);
      // attribute.attrValueList = attribute.attrValueList.filter(
      //   e => !originAttr.attrValueList.some(item => item.id === e.id)
      // );
      // console.log(attribute.attrValueList);
      loading.value = true;
      loadingText.value = attribute.id ? '修改属性中' : '添加属性中';
      attribute.categoryId = id3;
      attribute.categoryLevel = 3 - (id3 === id2 ? 1 : 0) - (id2 === id1 ? 1 : 0);
      const result = await reqSaveAttrInfo(attribute);
      if (result.code === 200) {
        await flushDate();
        ElMessage.success(attribute.id ? '修改成功' : '添加成功');
        cancel();
      } else {
        ElMessage.error(attribute.id ? '修改失败' : '添加失败');
      }
    } catch (e) {
      ElMessage.error(attribute.id ? '修改失败' : '添加失败');
    } finally {
      loading.value = false;
    }
  };

  const removeAttr = async (id: number) => {
    try {
      loading.value = true;
      loading.value = '删除中...';
      const result: ResponseData = await reqDeleteAttrByAttrId(id);
      if (result.code === 200) {
        ElMessage.success('删除成功');
        await flushDate();
      }
    } catch (e) {
      console.log(e);
      ElMessage.error('删除失败');
    } finally {
      loading.value = false;
    }
  };

  const toShow = (attr: AttributeValueType, $index: number) => {
    // 非法情况判断
    if (attr.valueName.trim() === '') {
      attribute.attrValueList.splice($index, 1);
      ElMessage.error('属性值名称不能为空');
      return;
    }
    if (attribute.attrValueList.some(v => v !== attr && v.valueName === attr.valueName.trim())) {
      attribute.attrValueList.splice($index, 1);
      ElMessage.error('属性值名称不能重复');
      return;
    }

    // eslint-disable-next-line no-param-reassign
    attr.flag = false;
  };
  const toEdit = async (attr: AttributeValueType) => {
    // eslint-disable-next-line no-param-reassign
    attr.flag = true;
    // 确保 DOM 渲染完毕
    await nextTick();
  };

  const inputRef = ref<HTMLInputElement | null>(null);

  // 注册自定义指令?
  const vFocus = {
    mounted: (el: any) => {
      const inputElement = el.querySelector('input');
      if (inputElement) {
        inputElement.focus();
      }
    },
  };
</script>

<template>
  <div>
    <Category
      :category3IdChanged="category3Changed"
      :isDisabled="0 !== scene"
      @clear-data="clearData()"
    />

    <el-card v-loading="loading" :element-loading-text="loadingText">
      <!-- 展示属性 -->
      <div v-show="0 === scene" class="table_div">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="btnDisabled"
          @click="addAttr()"
        >
          添加属性
        </el-button>
        <el-table :data="attrArr" border>
          <el-table-column label="序号" type="index" align="center" width="80px">
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="属性名称" width="120px">
            <template #default="{ row }">
              {{ row.attrName }}
            </template>
          </el-table-column>
          <el-table-column label="属性值名称">
            <template #default="{ row }">
              <el-tag
                v-for="item in row.attrValueList"
                :key="item.id"
                :type="tagTypes[item.attrId % tagTypes.length]"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #default="{ row }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm :title="`是否删除的${row.attrName}属性`" @confirm="removeAttr(row.id)">
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 展示添加属性与修改数据的结构 -->
      <div v-show="1 === scene" class="form_div">
        <el-form ref="addAttrFormRef" :model="attribute" :rules="rules" inline>
          <el-form-item label="属性名称" prop="attrName">
            <el-input v-model="attribute.attrName" placeholder="请输入属性名称"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="Plus" :disabled="!attribute.attrName" @click="addAttrValue">
          添加属性值
        </el-button>
        <el-button @click="cancel">取消</el-button>
        <el-table border :data="attribute.attrValueList">
          <el-table-column label="序号" width="80px" type="index" align="center"> </el-table-column>
          <el-table-column label="属性值名称">
            <template #default="{ row, $index }">
              <el-input
                v-if="row.flag"
                ref="inputRef"
                v-model="row.valueName"
                v-focus
                placeholder="请你输入属性值名称"
                size="small"
                @blur="toShow(row, $index)"
              />
              <div v-else @click="toEdit(row)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #default="{ $index }">
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="deleteAttrValue($index)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-button
          :disabled="attribute.attrValueList.length === 0 || !attribute.attrName"
          type="primary"
          @click="saveAttr"
        >
          保存
        </el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
  .el-card {
    margin: 10px 0;

    .table_div {
      margin: 10px 0;

      .el-table {
        margin: 10px 0;

        .el-tag {
          margin: 5px;
        }
      }
    }

    .form_div {
      margin: 10px 0;

      .el-table {
        margin: 10px 0;
      }
    }
  }
</style>
