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
        <el-table-column label="头像" width="80" align="center">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="会员名" align="center" />
        <el-table-column prop="phone" label="手机号" align="center" />
        <el-table-column label="性别" align="center">
          <template #default="{ row }">
            {{ row.gender === "male" ? "男" : "女" }}
          </template>
        </el-table-column>
        <el-table-column prop="memberLevel" label="会员等级" align="center" />
        <el-table-column prop="balance" label="账户余额" align="center">
          <template #default="{ row }"> ¥ {{ row.balance }} </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center" />
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
        <el-table-column prop="createTime" label="创建时间" align="center">
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
                @click="handleDelete(row.userId)"
                :disabled="row.balance !== 0"
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="性别">
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
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
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
  email: ""
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

/**
 * 获取会员列表数据
 */
const fetchData = async () => {
  console.log(searchParams);
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
 * 处理编辑会员按钮点击事件
 */
const handleEdit = (row: any) => {
  editForm.userId = row.userId;
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

onMounted(() => {
  fetchData();
});
</script>
