<script setup lang="ts">
  import { ref, reactive, onMounted, computed, nextTick } from 'vue';
  import { ElForm, ElMessage } from 'element-plus';
  import {
    reqDoAssign,
    reqGetUserList,
    reqRemoveUser,
    reqRemoveUserList,
    reqSaveOfUpdateUserInfo,
    reqToAssign,
  } from '@/api/acl/user/index.ts';
  import { User, UserList } from '@/api/acl/user/type.ts';
  import { ResponseData } from '@/api/type.ts';
  import { RoleList } from '@/api/acl/role/type.ts';

  // 场景枚举常量
  // eslint-disable-next-line no-shadow
  const enum SCENE {
    // 默认显示 用户列表
    SHOW_USER_LIST_SCENE = 0,
    // 添加角色
    ADD_USER_SCENE = 1,
    // 修改分配 用户角色
    EDIT_USER_ACL_SCENE = 2,
    // 修改角色
    UPDATE_USER_SCENE = 3,
  }
  const scene = ref<number>(SCENE.SHOW_USER_LIST_SCENE);
  const drawerFlag = computed<boolean>({
    get: () => {
      return scene.value !== SCENE.SHOW_USER_LIST_SCENE;
    },
    set: (value: boolean) => {
      if (!value) {
        scene.value = SCENE.SHOW_USER_LIST_SCENE;
      }
    },
  });
  const drawerTextList = ['', '添加用户', '分配用户角色', '编辑用户'];
  const pageNo = ref<number>(1);
  const limit = ref<number>(3);
  const total = ref<number>(0);
  const searchFormRef = ref<InstanceType<typeof ElForm> | null>(null);
  const searchData = reactive({
    username: '',
    name: '',
  });
  const userInfoList = ref<UserList>([]);
  const userList = ref<UserList>([]);

  type tmpType = {
    assignRoles: number[];
  };

  const userInfo = reactive<Partial<User> & tmpType>({
    id: undefined,
    createTime: undefined,
    updateTime: undefined,
    username: '',
    password: '',
    name: '',
    phone: '',
    roleName: '',
    assignRoles: [] as number[],
  });

  const flushTable = async () => {
    const result = await reqGetUserList(pageNo.value, limit.value, searchData as User);
    if (result.code === 200) {
      const { data } = result;
      userInfoList.value = data.records;
      pageNo.value = data.current;
      limit.value = data.size;
      total.value = data.total;
    }
  };

  onMounted(() => flushTable());

  const pageChanged = () => {
    flushTable();
  };

  const searchHandle = () => {
    flushTable();
  };

  const resetHandle = () => {
    searchFormRef.value!.resetFields();
  };

  const selectHandle = (newSelection: UserList) => {
    userList.value = newSelection;
  };

  const addUserFormRef = ref<InstanceType<typeof ElForm> | null>(null);
  const editUserAclFormRef = ref<InstanceType<typeof ElForm> | null>(null);
  const updateUserFormRef = ref<InstanceType<typeof ElForm> | null>(null);

  const addUserHandle = () => {
    // Object.assign(drawerList.value[SCENE.ADD_USER_SCENE], { args: [userInfo] });
    Object.assign(userInfo, { id: undefined });
    scene.value = SCENE.ADD_USER_SCENE;
    nextTick(() => {
      addUserFormRef.value?.clearValidate();
    });
  };

  const removeUserList = async () => {
    const result = await reqRemoveUserList(userList.value.map(({ id }) => id!));
    if (result.code === 200) {
      ElMessage.success('用户删除成功');
      await flushTable();
    } else {
      ElMessage.error('删除失败, 请稍后重试');
    }
  };

  const allRolesList = ref<RoleList>([]);
  const checkAll = ref(false);
  const isIndeterminate = ref(true);
  const handleCheckAllChange = (val: string | number | boolean): any => {
    console.log('val = ', val);
    userInfo.assignRoles = val ? allRolesList.value.map(item => item.id!) : [];
    // assignRoles.value = val ? allRolesList.value.map(item => item.roleName) : [];
    isIndeterminate.value = false;
  };

  const handleCheckedChange = (value: any): any => {
    console.log('value = ', value);
    const checkedCount = value ? value.length : 0;
    checkAll.value = checkedCount === allRolesList.value.length;
    isIndeterminate.value = checkedCount > 0 && checkedCount < allRolesList.value.length;
  };

  const editUserAclHandle = async (user: User) => {
    const result = await reqToAssign(user.id!);
    if (result.code === 200) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createTime, updateTime, ...rest } = user;
      Object.assign(userInfo, { ...rest });
      allRolesList.value = result.data.allRolesList;
      userInfo.assignRoles = result.data.assignRoles.map(item => item.id!);
      // Object.assign(drawerList.value[SCENE.EDIT_USER_ACL_SCENE], {
      //   args: [userInfo.id, userInfo.assignRoles],
      // });
      // assignRoles.value = result.data.assignRoles.map(item => item.roleName);
      checkAll.value = userInfo.assignRoles.length === allRolesList.value.length;
      isIndeterminate.value = userInfo.assignRoles.length > 0 && !checkAll.value;
      console.log('editUserAclHandle', userInfo);
      scene.value = SCENE.EDIT_USER_ACL_SCENE;
      await nextTick();
      editUserAclFormRef.value?.clearValidate();
    }
  };

  const updateUserHandle = async (user: User) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createTime, updateTime, ...rest } = user;
    Object.assign(userInfo, { ...rest });
    scene.value = SCENE.UPDATE_USER_SCENE;
    await nextTick();
    updateUserFormRef.value?.clearValidate();
  };

  const removeUserHandle = async (userId: number) => {
    const result = await reqRemoveUser(userId);
    if (result.code === 200) {
      ElMessage.success('删除成功');
      await flushTable();
    } else {
      ElMessage.error('删除失败, 请稍后重试');
    }
  };

  const cancelDrawer = async () => {
    Object.assign(userInfo, {
      id: undefined,
      createTime: undefined,
      updateTime: undefined,
      username: '',
      password: '',
      name: '',
      phone: '',
      roleName: '',
      assignRoles: [] as string[],
    });
    // assignRoles.value = [];
    allRolesList.value = [];
    isIndeterminate.value = false;
    await flushTable();
    // scene.value = SCENE.SHOW_USER_LIST_SCENE;
  };

  const submitDrawer = async () => {
    console.log('user.submitDrawer');
    let formRef: InstanceType<typeof ElForm>;
    let formReq: (...args: any[]) => Promise<ResponseData>;
    let formArgs: any[];
    switch (scene.value) {
      case SCENE.ADD_USER_SCENE:
        formRef = addUserFormRef.value!;
        formReq = reqSaveOfUpdateUserInfo;
        formArgs = [userInfo as User];
        break;
      case SCENE.EDIT_USER_ACL_SCENE:
        formRef = editUserAclFormRef.value!;
        formReq = reqDoAssign;
        formArgs = [userInfo.id!, userInfo.assignRoles];
        // formReq = reqDoAssignRole;
        // formArgs = [{ userId: userInfo.id!, roleIdList: userInfo.assignRoles } as RoleVo];
        break;
      case SCENE.UPDATE_USER_SCENE:
        formRef = updateUserFormRef.value!;
        formReq = reqSaveOfUpdateUserInfo;
        formArgs = [userInfo as User];
        break;
      default:
        ElMessage.error('你仿佛是从未知的黑洞穿越而来');
        return;
    }
    try {
      await formRef.validate();
      console.log('formArgs = ', formArgs);
      const result = await formReq(...formArgs);
      if (result.code === 200) {
        ElMessage.success(`${drawerTextList[scene.value]}成功`);
        if (scene.value === SCENE.ADD_USER_SCENE) {
          pageNo.value = 1;
        }
        // 防止信息更新完后没权限或信息不对版问题,  提交完后应该刷新浏览器请求后端重新判断
        window.location.reload();
        await cancelDrawer();
      } else {
        ElMessage.error('网络出现波动, 请稍后再试');
      }
    } catch (e) {
      console.log('e = ', e);
    }
  };
</script>

<template>
  <div>
    <el-card>
      <el-form
        ref="searchFormRef"
        :model="searchData"
        inline
        style="display: flex; justify-content: space-between; align-items: center"
      >
        <el-row>
          <el-col>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="searchData.username" placeholder="请输入要查询的用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-button type="primary" @click="searchHandle"> 搜索 </el-button>
            <el-button @click="resetHandle">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px">
      <el-button v-has="'btn.User.add'" type="primary" @click="addUserHandle">添加</el-button>
      <el-popconfirm :title="`确定删除${userList.length}个用户吗?`" @confirm="removeUserList">
        <template #reference>
          <el-button v-has="'btn.User.remove'" type="danger" :disabled="userList.length == 0"
            >批量删除</el-button
          >
        </template>
      </el-popconfirm>
      <el-table
        border
        style="margin: 10px 0"
        empty-text="#"
        :data="userInfoList"
        row-key="id"
        @selection-change="selectHandle"
      >
        <el-table-column type="selection" :reserve-selection="true" />
        <el-table-column type="index" lable="#" align="center" />
        <el-table-column label="id" prop="id" />
        <el-table-column label="用户名字" prop="username" show-overflow-tooltip />
        <el-table-column label="用户名称" prop="name" show-overflow-tooltip />
        <el-table-column label="用户角色" prop="roleName" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip />
        <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip />
        <el-table-column label="操作" width="300px">
          <template #default="{ row }">
            <el-button
              v-has="'btn.User.assgin'"
              type="primary"
              size="small"
              icon="User"
              @click="editUserAclHandle(row)"
              >分配角色</el-button
            >
            <el-button
              v-has="'btn.User.update'"
              type="primary"
              size="small"
              icon="Edit"
              @click="updateUserHandle(row)"
              >编辑</el-button
            >
            <el-popconfirm
              :title="`确定删除${row.username}用户吗?`"
              @confirm="removeUserHandle(row.id)"
            >
              <template #reference>
                <el-button v-has="'btn.User.remove'" type="primary" size="small" icon="Delete"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        v-model:page-no="pageNo"
        v-model:limit="limit"
        :total="total"
        @change="pageChanged"
      />
    </el-card>
    <el-drawer v-model="drawerFlag" :title="drawerTextList[scene]" @close="cancelDrawer">
      <div v-show="scene === SCENE.ADD_USER_SCENE">
        <el-form
          ref="addUserFormRef"
          :model="userInfo"
          :rules="{
            username: [
              { required: true, message: '请填写用户名字', trigger: 'blur' },
              { min: 5, message: '用户名至少需要五个字符', trigger: 'blur' },
            ],
            name: [
              { required: true, message: '请填写用户昵称', trigger: 'blur' },
              { min: 5, message: '用户昵称至少需要五个字符', trigger: 'blur' },
            ],
            password: [
              { required: true, message: '请填写用户密码', trigger: 'blur' },
              {
                pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\da-zA-Z]{6,15}$/,
                message: '密码要符合以下规则 1️⃣6到15位 2️⃣同时拥有大小写字母和数字',
                trigger: 'blur',
              },
            ],
          }"
        >
          <el-form-item label="用户姓名" prop="username">
            <el-input v-model="userInfo.username" placeholder="请填写用户名字" />
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input v-model="userInfo.name" placeholder="请填写用户昵称" />
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input v-model="userInfo.password" type="password" placeholder="请填写用户密码" />
          </el-form-item>
        </el-form>
      </div>
      <div v-show="scene === SCENE.EDIT_USER_ACL_SCENE">
        <el-form
          ref="editUserAclFormRef"
          :model="userInfo"
          :rules="{
            assignRoles: {
              required: true,
              validator: (__rule: any, value: string[] | undefined, callback: Function) => {
                if (value && value.length > 0) {
                  callback();
                } else {
                  callback(new Error('至少选择一个角色!'));
                }
              },
              trigger: 'change',
            },
          }"
        >
          <el-form-item label="用户姓名">
            <el-input v-model="userInfo.username" :disabled="true" />
          </el-form-item>
          <el-form-item label="角色列表" prop="assignRoles">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <el-checkbox-group
              v-model="userInfo.assignRoles"
              prop="roleName"
              @change="handleCheckedChange"
            >
              <el-checkbox
                v-for="role in allRolesList"
                :key="role.id!"
                :label="role.roleName"
                :value="role.id"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="scene === SCENE.UPDATE_USER_SCENE">
        <el-form
          ref="updateUserFormRef"
          :model="userInfo"
          :rules="{
            username: [
              { required: true, message: '请填写用户名字', trigger: 'blur' },
              { min: 5, message: '用户名至少需要五个字符', trigger: 'blur' },
            ],
            name: [
              { required: true, message: '请填写用户昵称', trigger: 'blur' },
              { min: 5, message: '用户昵称至少需要五个字符', trigger: 'blur' },
            ],
          }"
        >
          <el-form-item label="用户姓名" prop="username">
            <el-input v-model="userInfo.username" placeholder="请输入用户姓名" />
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input v-model="userInfo.name" placeholder="请输入用户昵称" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="drawerFlag = false">取消</el-button>
        <el-button type="primary" @click="submitDrawer">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped></style>
