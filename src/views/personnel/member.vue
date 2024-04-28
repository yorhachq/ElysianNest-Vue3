<template>
  <div class="member-container">
    <el-card class="flex flex-col max-h-full">
      <!--页面标题-->
      <template #header>
        <div class="card-header mt-1">
          <span class="font-bold text-lg">会员管理</span>
          <div class="float-end">
            <!--搜索框-->
            <el-input
              v-model="searchParams.username"
              placeholder="请输入会员名回车查询"
              clearable
              style="width: 165px; margin-right: 30px"
              @clear="fetchData"
              @keyup.enter="fetchData"
            />
            <!--添加会员按钮-->
            <el-button type="primary" @click="handleAdd">添加会员</el-button>
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
              <el-form-item label="会员等级">
                <el-select
                  v-model="searchParams.memberLevel"
                  placeholder="请选择会员等级"
                  style="width: 80px"
                  @change="fetchData"
                >
                  <el-option label="全部" value="" />
                  <el-option label="Lv.1" value="Lv.1" />
                  <el-option label="Lv.2" value="Lv.2" />
                  <el-option label="Lv.3" value="Lv.3" />
                  <el-option label="Lv.4" value="Lv.4" />
                  <el-option label="Lv.5" value="Lv.5" />
                  <el-option label="Lv.6" value="Lv.6" />
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
                  placeholder="请输入手机号回车查询"
                  style="width: 165px"
                  maxlength="11"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  @change="fetchData"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </template>

      <!--数据表格-->
      <el-table
        :data="memberList"
        height="calc(84vh - 161px)"
        max-height="70vh"
      >
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="头像" width="80" align="center">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="会员名" align="center" />
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
        <el-table-column
          prop="memberLevel"
          label="会员等级"
          align="center"
          width="105"
          sortable
        />
        <el-table-column
          prop="balance"
          label="账户余额"
          align="center"
          width="105"
          sortable
        >
          <template #default="{ row }"> ¥ {{ row.balance }}</template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180" align="center" />
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
        <el-table-column label="操作" align="center" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleRecharge(row)">
              充值
            </el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-tooltip
              effect="dark"
              content="只有余额为0的账户才能被删除"
              placement="top"
              :disabled="row.balance === 0"
            >
              <el-button
                type="danger"
                size="small"
                :disabled="row.balance !== 0"
                @click="handleDelete(row.userId)"
              >
                删除
              </el-button>
            </el-tooltip>
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

    <!--添加会员对话框-->
    <el-dialog v-model="addDialogVisible" title="添加会员" width="400px">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!--编辑会员对话框-->
    <el-dialog v-model="editDialogVisible" title="编辑会员" width="400px">
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
          <el-input v-model="editForm.username" />
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
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            plain
            type="primary"
            size="default"
            @click="handleUpdatePwd(editForm.userId)"
          >
            修改密码
          </el-button>
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEditConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!--充值对话框-->
    <el-dialog v-model="rechargeDialogVisible" title="会员充值" width="400px">
      <el-form ref="rechargeFormRef" :model="rechargeForm">
        <el-form-item label="充值金额" prop="amount">
          <el-input-number v-model="rechargeForm.amount" :min="10" />
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="rechargeForm.paymentMethod">
            <el-option label="支付宝" value="支付宝" />
            <el-option label="微信" value="微信" />
            <el-option label="现金" value="现金" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="rechargeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRechargeConfirm">
            确定
          </el-button>
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
import { Refresh } from "@element-plus/icons-vue";
import {
  getMemberList,
  addMember,
  updateMember,
  deleteMember,
  rechargeMember,
  getMemberInfo
} from "@/api/hotelMember";
import { updatePwdByAdmin } from "@/api/user";
import { Plus } from "@element-plus/icons-vue";
import { getToken } from "@/utils/auth";

defineOptions({
  name: "Member"
});
const searchParams = reactive({
  username: "",
  gender: "",
  phone: "",
  memberLevel: "",
  status: "",
  pageNum: 1,
  pageSize: 6,
  orderBy: "create_time",
  orderType: "desc"
});

const total = ref(0);
const memberList = ref<any[]>([]);

const addDialogVisible = ref(false);
const addForm = reactive({
  username: "",
  password: ""
});
const addFormRef = ref<FormInstance>();
const addFormRules: FormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
};

const editDialogVisible = ref(false);
const editForm = reactive({
  userId: 0,
  username: "",
  gender: "",
  phone: "",
  email: "",
  avatar: ""
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
  ]
};

const rechargeDialogVisible = ref(false);
const rechargeForm = reactive({
  memberId: 0,
  amount: 0,
  paymentMethod: "支付宝"
});
const rechargeFormRef = ref<FormInstance>();

const updatePwdDialogVisible = ref(false);
const updatePwdForm = reactive({
  userId: 0,
  newPwd: "",
  confirmPwd: ""
});
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

/**
 * 获取会员列表数据
 */
const fetchData = async () => {
  const res = await getMemberList(searchParams);
  memberList.value = res.data.items;
  total.value = res.data.total;
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
  await updateMember({
    userId: row.userId,
    status: row.status
  });
  row.status === "封禁"
    ? ElMessage.warning(`会员[${row.username}]账户已被封禁`)
    : ElMessage.success(`会员[${row.username}]账户已解封`);
};

/**
 * 处理添加会员按钮点击事件
 */
const handleAdd = () => {
  addForm.username = "";
  addForm.password = "";
  addDialogVisible.value = true;
};

/**
 * 处理添加会员对话框确认事件
 */
const handleAddConfirm = async () => {
  await addFormRef.value?.validate(async valid => {
    if (valid) {
      await addMember(addForm);
      ElMessage.success("添加会员成功");
      addDialogVisible.value = false;
      await fetchData();
    }
  });
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
 * 处理编辑会员按钮点击事件
 */
const handleEdit = (row: any) => {
  editForm.userId = row.userId;
  editForm.avatar = row.avatar;
  editForm.username = row.username;
  editForm.gender = row.gender;
  editForm.phone = row.phone;
  editForm.email = row.email;
  editDialogVisible.value = true;
};

/**
 * 处理编辑会员对话框确认事件
 */
const handleEditConfirm = async () => {
  await editFormRef.value?.validate(async valid => {
    if (valid) {
      await updateMember(editForm);
      ElMessage.success("编辑会员成功");
      editDialogVisible.value = false;
      await fetchData();
    }
  });
};

/**
 * 处理删除会员按钮点击事件
 */
const handleDelete = (userId: number) => {
  ElMessageBox.confirm("确定删除该会员吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    const res = await getMemberInfo(userId);
    if (res.data.balance !== 0) {
      ElMessage.warning("该会员账户余额不为0,不能删除");
      return;
    }
    await deleteMember(userId);
    ElMessage.success("删除成功");
    await fetchData();
  });
};

/**
 * 处理充值按钮点击事件
 */
const handleRecharge = (row: any) => {
  rechargeForm.memberId = row.memberId;
  rechargeForm.amount = 0;
  rechargeForm.paymentMethod = "现金";
  rechargeDialogVisible.value = true;
};

/**
 * 处理充值对话框确认事件
 */
const handleRechargeConfirm = async () => {
  await rechargeFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      await rechargeMember(rechargeForm);
      ElMessage.success("充值成功");
      rechargeDialogVisible.value = false;
      await fetchData();
    }
  });
};

/**
 * 处理刷新按钮点击事件
 */
const handleRefresh = () => {
  searchParams.username = "";
  searchParams.gender = "";
  searchParams.phone = "";
  searchParams.memberLevel = "";
  searchParams.status = "";
  searchParams.pageNum = 1;
  searchParams.pageSize = 10;
  fetchData();
};

/**
 * 格式化时间
 */
const formatTime = (time: string) => {
  return time.replace("T", " ");
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
});
</script>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
