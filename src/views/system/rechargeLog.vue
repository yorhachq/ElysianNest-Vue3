<template>
  <div class="recharge-container">
    <el-card class="flex flex-col max-h-full">
      <!--页面标题-->
      <template #header>
        <div class="card-header mt-1">
          <span class="font-bold text-lg">充值记录</span>
          <div class="float-end">
            <!--导出Excel-->
            <el-button type="primary" @click="exportData">导出Excel</el-button>
            <!--刷新按钮-->
            <el-button
              type="text"
              :icon="Refresh"
              circle
              @click="handleRefresh"
            />
          </div>
          <div class="float-end -mb-4">
            <!--筛选表单-->
            <el-form :inline="true" :model="searchParams">
              <el-form-item>
                <el-input
                  v-model="searchParams.username"
                  placeholder="请输入用户名查询"
                  clearable
                  style="width: 140px"
                  @clear="fetchData"
                  @keyup.enter="fetchData"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="searchParams.phone"
                  placeholder="请输入手机号回车查询"
                  clearable
                  style="width: 165px"
                  maxlength="11"
                  oninput="value=value.replace(/\D/g,'')"
                  @clear="fetchData"
                  @keyup.enter="fetchData"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="searchParams.email"
                  placeholder="请输入邮箱回车查询"
                  clearable
                  style="width: 150px"
                  @clear="fetchData"
                  @keyup.enter="fetchData"
                />
              </el-form-item>
              <el-form-item label="支付方式">
                <el-select
                  v-model="searchParams.paymentMethod"
                  placeholder="请选择支付方式"
                  clearable
                  style="width: 150px"
                  @clear="fetchData"
                  @change="fetchData"
                >
                  <el-option label="全部" value="" />
                  <el-option label="支付宝" value="支付宝" />
                  <el-option label="微信" value="微信" />
                  <el-option label="现金" value="现金" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </template>

      <!--数据表格-->
      <el-table
        :data="rechargeList"
        height="calc(80vh - 158px)"
        max-height="70vh"
        border
      >
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
          :resizable="false"
        />
        <el-table-column
          prop="username"
          label="用户名"
          align="center"
          :resizable="false"
        />
        <el-table-column
          prop="phone"
          label="手机号"
          align="center"
          :resizable="false"
        />
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
          :resizable="false"
        />
        <el-table-column
          prop="amount"
          label="充值金额"
          align="center"
          sortable
          :resizable="false"
        >
          <template #default="{ row }"> ¥ {{ row.amount }}</template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="支付方式" align="center" />
        <el-table-column
          prop="createTime"
          label="充值时间"
          align="center"
          width="180"
          sortable
          :resizable="false"
        >
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
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
          :page-sizes="[9, 20, 30, 50]"
          :page-size="searchParams.pageSize"
          :current-page="searchParams.pageNum"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Refresh } from "@element-plus/icons-vue";
import { getRechargeList } from "@/api/log";
import { exportExcel } from "@/views/components/exportExcel";

const searchParams = reactive({
  username: "",
  phone: "",
  email: "",
  paymentMethod: "",
  pageNum: 1,
  pageSize: 9
});

const total = ref(0);
const rechargeList = ref<any[]>([]);

/**
 * 获取充值记录列表数据
 */
const fetchData = async () => {
  const res = await getRechargeList(searchParams);
  rechargeList.value = res.data.items;
  total.value = res.data.total;
};

const allTableData = ref([]);
/**
 * 获取所有数据(导出用)
 */
const getAllTableData = async () => {
  try {
    const res = await getRechargeList({
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
    fileName: "rechargeLog"
  });
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
 * 处理刷新按钮点击事件
 */
const handleRefresh = () => {
  searchParams.username = "";
  searchParams.phone = "";
  searchParams.email = "";
  searchParams.paymentMethod = "";
  searchParams.pageNum = 1;
  searchParams.pageSize = 9;
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
