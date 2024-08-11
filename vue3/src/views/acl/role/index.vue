<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import { Role, RoleList } from '@/api/acl/role/type.ts';
  import { ElForm, ElMessage, ElTree, TreeNode } from 'element-plus';
  import { reqDeleteRole, reqGetRoleList, reqSaveOrUpdateRole } from '@/api/acl/role/index.ts';
  import { PermissionType } from '@/api/acl/permission/type.ts';
  import { reqDoAssign, reqGetPermissionListById } from '@/api/acl/permission/index.ts';

  const searchFormRef = ref<InstanceType<typeof ElForm> | null>(null);
  const searchData = reactive<Role>({ roleName: '' } as Role);
  const roleList = ref<RoleList>([]);
  const pageNo = ref<number>(1);
  const limit = ref<number>(3);
  const total = ref<number>(0);
  const dialogDisable = ref(false);
  const dialogTitle = ref<string>('');
  const addOrUpdateFormRef = ref<InstanceType<typeof ElForm> | null>(null);
  const addOrUpdateForm = reactive<Role>({
    roleName: '',
    remark: null,
  });
  const permissionList = ref<PermissionType[]>([]);
  const roleId = ref<number | string>('');
  const defaultCheckedIdList = ref<number[]>([]);
  const permissionIdList = ref<Array<number>>([]);
  const ALL_CHECKED_PERMISSION_ID = 100;
  const drawerFlag = ref(false);
  const drawerTreeRef = ref<InstanceType<typeof ElTree> | null>(null);

  const flushTable = async () => {
    const result = await reqGetRoleList(pageNo.value, limit.value, searchData as Role);
    if (result.code === 200) {
      const { data } = result;
      roleList.value = data.records;
      limit.value = data.size;
      pageNo.value = data.current;
      total.value = data.total;
    }
  };

  const pageChanged = () => flushTable();

  onMounted(() => flushTable());

  const searchHandle = async () => {
    // await searchFormRef.value!.validate();
    await flushTable();
  };

  const resetHandle = () => {
    searchFormRef.value!.resetFields();
    flushTable();
  };

  const addRole = () => {
    dialogDisable.value = true;
    dialogTitle.value = '添加角色';
  };

  // 事实上只需要勾选和收集最后一层级的选项, 其中上级勾选必定说明子级也全部勾选 也便收集成功
  const getDeepCheckedIds = (
    nodes: PermissionType[]
  ): { defaultArr: Array<number>; dataArr: Array<number> } => {
    let defaultRes: number[] = [];
    let dataRes: number[] = [];
    if (nodes && nodes.length > 0) {
      nodes.forEach(node => {
        if (node.select) {
          dataRes.push(node.id);
          if (node.children && node.children.length > 0) {
            const { defaultArr, dataArr } = getDeepCheckedIds(node.children!);
            dataRes = [...dataRes, ...dataArr];
            defaultRes = [...defaultRes, ...defaultArr];
          } else {
            defaultRes.push(node.id);
          }
        }
      });
    }
    return { defaultArr: defaultRes, dataArr: dataRes };
  };

  const assignAcl = async (id: number) => {
    roleId.value = id;
    const result = await reqGetPermissionListById(id);
    if (result.code === 200) {
      permissionList.value = result.data;
      drawerFlag.value = true;
      const { defaultArr, dataArr } = getDeepCheckedIds(permissionList.value);
      defaultCheckedIdList.value = defaultArr;
      permissionIdList.value = dataArr;
      console.log('defaultCheckedIdList.value = ', defaultCheckedIdList.value);
      console.log('permissionIdList.value = ', permissionIdList.value);
    } else {
      ElMessage.error('网络出错, 请重试');
    }
  };

  /*  const checkChangeHandle = (data: PermissionType, checked: boolean, indeterminate: boolean) => {
    console.log('checkChange', data, checked, indeterminate);
    function deepChecked(node: PermissionType, isChecked: boolean) {
      // eslint-disable-next-line no-param-reassign
      node.select = isChecked;
      node.children.forEach(child => deepChecked(child, isChecked));
    }
    deepChecked(data, checked);
  }; */

  interface TreeCheckData {
    checkedNodes: Array<TreeNode>;
    checkedKeys: Array<string | number>;
    halfCheckedNodes: Array<TreeNode>;
    halfCheckedKeys: Array<string | number>;
  }

  const checkHandle = (data1: PermissionType, data2: TreeCheckData) => {
    // 选择全部选项主动全选
    // console.log('data1 = ', data1);
    if (data1.id === ALL_CHECKED_PERMISSION_ID) {
      drawerTreeRef.value!.setChecked(
        1,
        data2.checkedKeys.some(item => item === ALL_CHECKED_PERMISSION_ID),
        true
      );
    }
    permissionIdList.value = [...data2.halfCheckedKeys, ...data2.checkedKeys] as number[];
    console.log(permissionIdList.value);
  };

  const cancelDrawer = () => {
    permissionList.value = [] as PermissionType[];
    defaultCheckedIdList.value = [] as Array<number>;
    drawerFlag.value = false;
    roleId.value = '';
  };

  const submitDrawer = async () => {
    const result = await reqDoAssign(roleId.value as number, permissionIdList.value);
    if (result.code === 200) {
      ElMessage.success('权限分配成功');
      // cancelDrawer();
      // 由于权限相关, 事实上刷新即可,  不需要使用cancel去除数据
      window.location.reload();
    } else {
      ElMessage.error('权限分配失败, 请重试');
      console.log(result);
    }
  };

  const editRole = (role: Role) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createTime, updateTime, ...rest } = role;
    dialogTitle.value = '修改角色';
    Object.assign(addOrUpdateForm, rest);
    dialogDisable.value = true;
  };

  const removeRole = async (id: number) => {
    const result = await reqDeleteRole(id);
    if (result.code === 200) {
      ElMessage.success('删除成功');
      await flushTable();
    } else {
      ElMessage.error('删除失败');
      console.log('removeRole', result.message);
    }
  };

  const dialogCancelHandle = () => {
    Object.assign(addOrUpdateForm, {
      id: undefined,
      roleName: '',
      remark: null,
    });
    addOrUpdateFormRef.value!.clearValidate();
    flushTable();
    dialogDisable.value = false;
  };

  const saveOrUpdateRoleHandle = async () => {
    await addOrUpdateFormRef.value!.validate();
    const result = await reqSaveOrUpdateRole(addOrUpdateForm);
    if (result.code === 200) {
      ElMessage.success('保存成功');
      dialogCancelHandle();
    } else {
      ElMessage.error('保存失败');
      console.log('saveRoleHandle', result.message);
    }
  };
</script>

<template>
  <div>
    <el-card style="margin: 10px 0">
      <el-form ref="searchFormRef" :model="searchData" :inline="true">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="searchData.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchHandle">搜索</el-button>
          <el-button @click="resetHandle">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-button v-has="'btn.Role.add'" type="primary" icon="Plus" @click="addRole"
        >添加角色</el-button
      >
      <el-table border style="margin: 10px 0" :data="roleList">
        <el-table-column type="index" label="#" align="center" />
        <el-table-column label="id" prop="id" />
        <el-table-column label="角色名称" prop="roleName" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip />
        <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip />
        <el-table-column label="操作" width="300px">
          <template #default="{ row }">
            <el-button
              v-has="'btn.Role.assgin'"
              type="primary"
              size="small"
              icon="User"
              @click="assignAcl(row.id)"
              >分配权限</el-button
            >
            <el-button
              v-has="'btn.Role.update'"
              type="primary"
              size="small"
              icon="Edit"
              @click="editRole(row)"
              >编辑</el-button
            >
            <el-popconfirm :title="`确定删除${row.roleName}用户吗?`" @confirm="removeRole(row.id)">
              <template #reference>
                <el-button v-has="'btn.Role.remove'" type="primary" size="small" icon="Delete"
                  >删除</el-button
                >
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
    </el-card>
    <el-dialog v-model="dialogDisable" :title="dialogTitle" width="500" @close="dialogCancelHandle">
      <el-form
        ref="addOrUpdateFormRef"
        :model="addOrUpdateForm"
        :rule="{
          roleName: { required: true, message: '请输入角色名称', trigger: 'blur' },
        }"
      >
        <el-form-item label="角色名称">
          <el-input
            v-model="addOrUpdateForm.roleName"
            prop="roleName"
            autocomplete="off"
            placeholder="请填写角色名称"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogDisable = false"> 取消 </el-button>
          <el-button type="primary" @click="saveOrUpdateRoleHandle"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <el-drawer v-model="drawerFlag" title="分配权限" @close="cancelDrawer">
      <el-tree
        ref="drawerTreeRef"
        show-checkbox
        :data="permissionList"
        :props="{
          children: 'children',
          label: 'name',
        }"
        :default-expand-all="true"
        :default-checked-keys="defaultCheckedIdList"
        node-key="id"
        @check="checkHandle"
      />
      <template #footer>
        <el-button @click="drawerFlag = false">取消</el-button>
        <el-button type="primary" @click="submitDrawer">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped></style>
