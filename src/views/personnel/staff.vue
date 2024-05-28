<template>
  <div class="user-container">
    <el-card class="flex flex-col max-h-full">
      <!--页面标题-->
      <template #header>
        <div class="card-header mt-1">
          <span class="font-bold text-lg">员工管理</span>
          <div class="float-end">
            <!--搜索框-->
            <el-input
              v-model="searchParams.username"
              placeholder="请输入用户名"
              clearable
              style="width: 110px; margin-right: 30px"
              @clear="fetchData"
              @keyup.enter="fetchData"
            />
            <!--添加会员按钮-->
            <el-button type="primary" @click="handleAdd">添加员工</el-button>
            <!--导出Excel-->
            <el-button type="primary" @click="exportData">导出Excel</el-button>
            <!--刷新按钮-->
            <el-button
              type="text"
              :icon="Refresh"
              circle
              style="margin-left: 10px"
              @click="handleRefresh"
            />
          </div>
          <div class="float-end -mb-4">
            <!--筛选表单-->
            <el-form :inline="true" :model="searchParams">
              <el-form-item label="角色">
                <el-select
                  v-model="searchParams.roleCode"
                  placeholder="请选择角色"
                  style="width: 80px"
                  @change="fetchData"
                >
                  <el-option label="全部" value="" />
                  <el-option
                    v-for="role in roleList"
                    :key="role.roleId"
                    :label="`${role.roleName}(${role.roleCode})`"
                    :value="role.roleCode"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="账户状态">
                <el-select
                  v-model="searchParams.status"
                  placeholder="请选择账户状态"
                  style="width: 80px"
                  @change="fetchData"
                >
                  <el-option label="全部" value="" />
                  <el-option label="正常" value="正常" />
                  <el-option label="封禁" value="封禁" />
                </el-select>
              </el-form-item>
              <el-form-item label="性别">
                <el-select
                  v-model="searchParams.gender"
                  placeholder="请选择性别"
                  style="width: 80px"
                  @change="fetchData"
                >
                  <el-option label="全部" value="" />
                  <el-option label="男" value="male" />
                  <el-option label="女" value="female" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="searchParams.phone"
                  placeholder="请输入手机号"
                  style="width: 110px"
                  maxlength="11"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  @change="fetchData"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="searchParams.email"
                  placeholder="请输入邮箱"
                  style="width: 110px"
                  @change="fetchData"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </template>

      <!--数据表格-->
      <el-table :data="userList" height="calc(84vh - 161px)" max-height="70vh">
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="头像" width="80" align="center">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="员工名" align="center" />
        <el-table-column
          prop="phone"
          label="手机号"
          width="120"
          align="center"
        />
        <el-table-column label="性别" align="center">
          <template #default="{ row }">
            {{ row.gender === "male" ? "男" : "女" }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180" align="center" />
        <el-table-column label="角色" align="center">
          <template #default="{ row }">
            {{ `${row.roleName}(${row.roleCode})` }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="正常"
              active-text="正常"
              inactive-value="封禁"
              inactive-text="封禁"
              inline-prompt
              size="large"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          width="105"
          sortable
        >
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template #default="{ row }">
            <el-button type="warning" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="handleUpdatePwd(row.userId)"
            >
              修改密码
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row.userId)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页条-->
      <div class="mt-4">
        <el-pagination
          class="flex float-end"
          background
          layout="total, sizes, prev, pager, next, jumper, ->,"
          :total="total"
          :page-sizes="[6, 10, 30, 50]"
          :page-size="searchParams.pageSize"
          :current-page="searchParams.pageNum"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!--添加员工对话框-->
    <el-dialog v-model="addDialogVisible" title="添加员工" width="400px">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="密&emsp;码" prop="password">
          <el-input v-model="addForm.password" type="password" />
        </el-form-item>
        <el-form-item label="角&emsp;色" prop="role">
          <el-select v-model="addForm.role" placeholder="请选择角色">
            <el-option
              v-for="role in roleList"
              :key="role.roleId"
              :label="role.roleName"
              :value="role.roleCode"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!--编辑员工对话框-->
    <el-dialog v-model="editDialogVisible" title="编辑员工" width="400px">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules">
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :headers="{ Authorization: getToken().accessToken }"
            :auto-upload="true"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled/>
        </el-form-item>
        <el-form-item label="性别" class="ml-6">
          <el-radio-group v-model="editForm.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="editForm.phone"
            maxlength="11"
            oninput="value=value.replace(/[^\d]/g,'')"
          />
        </el-form-item>
        <el-form-item label="邮&emsp;箱" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="角&emsp;色" prop="roleId">
          <el-select v-model="editForm.roleId" placeholder="请选择角色">
            <el-option
              v-for="role in roleList"
              :key="role.roleId"
              :label="role.roleName"
              :value="role.roleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账户状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择账户状态">
            <el-option label="正常" value="正常" />
            <el-option label="封禁" value="封禁" />
            <el-option label="冻结" value="冻结" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEditConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!--修改密码对话框-->
    <el-dialog v-model="updatePwdDialogVisible" title="修改密码" width="400px">
      <el-form
        ref="updatePwdFormRef"
        :model="updatePwdForm"
        :rules="updatePwdFormRules"
      >
        <el-form-item label="新&ensp;密&ensp;码" prop="newPwd">
          <el-input
            v-model="updatePwdForm.newPwd"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input
            v-model="updatePwdForm.confirmPwd"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="updatePwdDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdatePwdConfirm"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus";
import { Plus, Refresh } from "@element-plus/icons-vue";
import {
  getUserList,
  registerUser,
  updateUserByAdmin,
  deleteUser,
  getRoleList,
  updatePwdByAdmin
} from "@/api/user";
import { getToken } from "@/utils/auth";
import { exportExcel } from "@/views/components/exportExcel";

const searchParams = reactive({
  username: "",
  gender: "",
  phone: "",
  email: "",
  roleCode: "",
  status: "",
  pageNum: 1,
  pageSize: 6,
  orderBy: "user_id",
  orderType: "asc"
});

const total = ref(0);
const userList = ref<any[]>([]);
const roleList = ref<any[]>([]);

const addDialogVisible = ref(false);
const addForm = reactive({
  username: "",
  password: "",
  role: ""
});
const addFormRef = ref<FormInstance>();
const addFormRules: FormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  role: [{ required: true, message: "请选择角色", trigger: "change" }]
};
const updatePwdDialogVisible = ref(false);
const updatePwdFormRef = ref<FormInstance>();
const updatePwdFormRules: FormRules = {
  newPwd: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 5, max: 16, message: "密码长度应为5~16位", trigger: "blur" }
  ],
  confirmPwd: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== updatePwdForm.newPwd) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
};
const updatePwdForm = reactive({
  userId: 0,
  newPwd: "",
  confirmPwd: ""
});
const editDialogVisible = ref(false);
const editForm = reactive({
  userId: 0,
  username: "",
  gender: "",
  phone: "",
  email: "",
  roleId: 0,
  avatar: "",
  status: ""
});
const editFormRef = ref<FormInstance>();
const editFormRules: FormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur"
    }
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"]
    }
  ],
  roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
  status: [{ required: true, message: "请选择账户状态", trigger: "change" }]
};

/**
 * 获取员工列表数据
 */
const fetchData = async () => {
  const res = await getUserList(searchParams);
  userList.value = res.data.items;
  total.value = res.data.total;
};

const allTableData = ref([]);
/**
 * 获取所有数据(导出用)
 */
const getAllTableData = async () => {
  console.log(searchParams);
  try {
    const res = await getUserList({
      ...searchParams,
      pageNum: 1,
      pageSize: total.value
    });
    allTableData.value = res.data.items;
  } catch (error) {
    console.error("数据导出失败:", error);
  }
};

/**
 * 导出数据
 */
const exportData = async () => {
  await getAllTableData();
  exportExcel({
    data: allTableData.value,
    fileName: "staff"
  });
};

/**
 * 获取角色列表数据
 */
const fetchRoleList = async () => {
  const res = await getRoleList();
  // 去除其中的酒店顾客角色
  res.data = res.data.filter((role: any) => role.roleCode !== "guest");
  roleList.value = res.data;
};

/**
 * 处理分页大小变化事件
 */
const handleSizeChange = (val: number) => {
  searchParams.pageSize = val;
  fetchData();
};

/**
 * 处理页码变化事件
 */
const handlePageChange = (val: number) => {
  searchParams.pageNum = val;
  fetchData();
};

/**
 * 处理账户状态切换事件
 */
const handleStatusChange = async (row: any) => {
  await updateUserByAdmin({
    userId: row.userId,
    status: row.status
  });
  row.status === "封禁"
    ? ElMessage.warning(`员工[${row.username}]账户已被封禁`)
    : ElMessage.success(`员工[${row.username}]账户已解封`);
};

/**
 * 处理添加员工按钮点击事件
 */
const handleAdd = () => {
  addForm.username = "";
  addForm.password = "";
  addForm.role = "";
  addDialogVisible.value = true;
};

/**
 * 处理添加员工对话框确认事件
 */
const handleAddConfirm = async () => {
  await addFormRef.value?.validate(async valid => {
    if (valid) {
      await registerUser({
        username: addForm.username,
        password: addForm.password,
        role: addForm.role
      });
      ElMessage.success("添加员工成功");
      addDialogVisible.value = false;
      await fetchData();
    }
  });
};

/**
 * 处理编辑员工按钮点击事件
 */
const handleEdit = (row: any) => {
  editForm.userId = row.userId;
  editForm.username = row.username;
  editForm.gender = row.gender;
  editForm.phone = row.phone;
  editForm.email = row.email;
  editForm.roleId = row.roleId;
  editForm.status = row.status;
  editForm.avatar = row.avatar;
  editDialogVisible.value = true;
};

/**
 * 处理修改密码按钮点击事件
 */
const handleUpdatePwd = (userId: number) => {
  updatePwdForm.userId = userId;
  updatePwdForm.newPwd = "";
  updatePwdForm.confirmPwd = "";
  updatePwdDialogVisible.value = true;
};

/**
 * 处理编辑员工对话框确认事件
 */
const handleEditConfirm = async () => {
  await editFormRef.value?.validate(async valid => {
    if (valid) {
      await updateUserByAdmin(editForm);
      ElMessage.success("编辑员工成功");
      editDialogVisible.value = false;
      await fetchData();
    }
  });
};

/**
 * 处理删除员工按钮点击事件
 */
const handleDelete = (userId: number) => {
  ElMessageBox.confirm("确定删除该员工吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await deleteUser(userId);
    ElMessage.success("删除成功");
    await fetchData();
  });
};

/**
 * 处理刷新按钮点击事件
 */
const handleRefresh = () => {
  searchParams.username = "";
  searchParams.gender = "";
  searchParams.phone = "";
  searchParams.email = "";
  searchParams.roleCode = "";
  searchParams.status = "";
  searchParams.pageNum = 1;
  searchParams.pageSize = 6;
  fetchData();
};

/**
 * 格式化时间
 */
const formatTime = (time: string) => {
  return time.replace("T", " ");
};

/**
 * 上传头像成功回调
 */
const handleAvatarSuccess = response => {
  // 上传头像成功后的回调
  editForm.avatar = response.data;
};

/**
 * 上传头像前的校验
 */
const beforeAvatarUpload = (rawFile: any) => {
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    ElMessage.error("头像必须是 JPG/PNG 格式!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error("头像大小不能超过 5MB!");
    return false;
  }
  return true;
};

/**
 * 处理修改密码对话框确认事件
 */
const handleUpdatePwdConfirm = async () => {
  await updatePwdFormRef.value?.validate(async valid => {
    if (valid) {
      await updatePwdByAdmin({
        userId: updatePwdForm.userId.toString(),
        newPwd: updatePwdForm.newPwd
      });
      ElMessage.success("密码修改成功");
      updatePwdDialogVisible.value = false;
      await fetchData();
    }
  });
};

onMounted(() => {
  fetchData();
  fetchRoleList();
});
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

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
</style>
