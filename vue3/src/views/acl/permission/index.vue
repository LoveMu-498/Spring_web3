<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import { PermissionType } from '@/api/acl/permission/type.ts';
  import {
    reqGetPermissionList,
    reqRemovePermission,
    reqSaveOrUpdatePermission,
  } from '@/api/acl/permission/index.ts';
  import { ElForm, ElMessage } from 'element-plus';
  import { TransformTypes } from '@/utils/transformType.ts';

  const permissionArr = ref<PermissionType[]>([]);
  const dialogFormVisible = ref(false);
  const dialogFormTitle = ref<string>('');
  const permissionFormRef = ref<InstanceType<typeof ElForm> | null>(null);
  const permission = reactive<
    TransformTypes<PermissionType, ['pid', 'code', 'name', 'children', 'level']>
  >({
    id: undefined,
    pid: 0,
    code: '',
    name: '',
    children: [],
    level: 0,
  });

  const flushTable = async () => {
    const result = await reqGetPermissionList();
    if (result.code === 200) {
      permissionArr.value = result.data;
    }
  };

  onMounted(async () => {
    await flushTable();
  });

  const dialogCancelHandle = () => {
    Object.assign(permission, {
      id: undefined,
      pid: 0,
      code: '',
      name: '',
      children: [],
      level: 0,
    });
    permissionFormRef.value!.clearValidate();
  };

  const addOrEditPermission = async () => {
    await permissionFormRef.value!.validate();
    const result = await reqSaveOrUpdatePermission(permission as PermissionType);
    if (result.code === 200) {
      ElMessage.success(permission.id ? '修改菜单成功' : '保存菜单成功');
      await flushTable();
      dialogFormVisible.value = false;
      dialogCancelHandle();
    } else {
      ElMessage.error(permission.id ? '修改菜单失败' : '保存菜单失败');
    }
  };

  const addPermission = (permissionInfo: PermissionType) => {
    dialogFormTitle.value = '添加菜单';
    permission.pid = permissionInfo.id;
    permission.level = permissionInfo.level + 1;
    dialogFormVisible.value = true;
  };

  const editPermission = (permissionInfo: PermissionType) => {
    dialogFormTitle.value = '修改菜单';
    const { id, pid, code, name, children, level } = permissionInfo;
    Object.assign(permission, { id, pid, code, name, children, level });
    dialogFormVisible.value = true;
  };

  const removePermission = async (id: number) => {
    const result = await reqRemovePermission(id);
    if (result.code === 200) {
      ElMessage.success('删除菜单成功');
      await flushTable();
    } else {
      ElMessage.error('删除菜单失败');
    }
  };
</script>

<template>
  <div>
    <el-table border :data="permissionArr" :tree-props="{ children: 'children' }" row-key="id">
      <el-table-column label="名称" prop="name" />
      <el-table-column label="权限值" prop="code" />
      <el-table-column label="修改时间" prop="updateTime" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            v-has="'btn.Permission.add'"
            type="primary"
            size="small"
            :disabled="row.level === 4"
            @click="addPermission(row)"
            >{{ row.level === 3 ? '添加功能' : '添加菜单' }}</el-button
          >
          <el-button
            v-has="'btn.Permission.update'"
            type="primary"
            size="small"
            :disabled="row.level === 1"
            @click="editPermission(row)"
            >编辑</el-button
          >
          <el-popconfirm
            :title="`确定删除${row.name}个菜单吗?`"
            @confirm="removePermission(row.id)"
          >
            <template #reference>
              <el-button
                v-has="'btn.Permission.remove'"
                type="primary"
                size="small"
                :disabled="row.level === 1"
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogFormVisible"
      :title="dialogFormTitle"
      width="500"
      @close="dialogCancelHandle"
    >
      <el-form
        ref="permissionFormRef"
        :model="permission"
        :rules="{
          name: { required: true, message: '请填写名称', trigger: 'blur' },
          code: { required: true, message: '请填权限值', trigger: 'blur' },
        }"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="permission.name" placeholder="请填写名称" />
        </el-form-item>
        <el-form-item label="权限值" prop="code">
          <el-input v-model="permission.code" placeholder="请填权限值" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addOrEditPermission"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
