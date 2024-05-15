<template>
  <div class="checkin-container">
    <el-card class="flex flex-col max-h-full">
      <!--页面标题-->
      <template #header>
        <div class="card-header mt-1">
          <span class="font-bold text-lg">入住管理</span>
          <div class="float-end">
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
              <el-form-item label="房间号">
                <el-input
                  v-model="searchParams.roomNumber"
                  type="number"
                  min="1"
                  :controls="false"
                  placeholder="请输入房间号"
                  style="width: 130px"
                  @change="fetchData"
                />
              </el-form-item>
              <el-form-item label="入住日期">
                <el-date-picker
                  v-model="searchParams.checkinDate"
                  type="date"
                  placeholder="请选择入住日期"
                  style="width: 150px"
                  value-format="YYYY-MM-DD"
                  @change="fetchData"
                />
              </el-form-item>
              <el-form-item label="退房日期">
                <el-date-picker
                  v-model="searchParams.checkoutDate"
                  type="date"
                  placeholder="请选择退房日期"
                  style="width: 150px"
                  value-format="YYYY-MM-DD"
                  @change="fetchData"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </template>

      <!--数据表格-->
      <el-table :data="orderList" height="calc(84vh - 173px)" max-height="70vh">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="100rem"
          sortable
        />
        <el-table-column
          prop="roomNumber"
          label="房间号"
          align="center"
          sortable
        />
        <el-table-column prop="typeName" label="房型" align="center" />
        <el-table-column prop="username" label="会员名" align="center" />
        <el-table-column prop="gender" label="性别" align="center" sortable>
          <template #default="scope">
            {{ scope.row.gender === "male" ? "男" : "女" }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系方式" align="center" />
        <el-table-column
          prop="checkinDate"
          label="入住日期"
          align="center"
          sortable
        >
          <template #default="scope">
            {{ formatDate(scope.row.checkinDate) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="checkoutDate"
          label="退房日期"
          align="center"
          sortable
        >
          <template #default="scope">
            {{ formatDate(scope.row.checkoutDate) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="payment"
          label="支付金额"
          align="center"
          sortable
        >
          <template #default="scope"> ¥ {{ scope.row.payment }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleCheckout(scope.row)"
              >办理退房
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
          :page-sizes="[9, 10, 30, 50]"
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
import { ElMessage, ElMessageBox } from "element-plus";
import {
  HotelOrder,
  checkoutOrder,
  getCheckinOrderList
} from "@/api/hotelOrder";
import { Refresh } from "@element-plus/icons-vue";
import {exportExcel} from "@/views/components/exportExcel";

const orderList = ref<HotelOrder[]>([]);
const total = ref(0);
const searchParams = reactive({
  roomNumber: "",
  checkinDate: "",
  checkoutDate: "",
  pageNum: 1,
  pageSize: 9,
  status: "入住中"
});

defineOptions({
  name: "Checkin"
});

onMounted(() => {
  fetchData();
});

/**
 * 获取入住订单列表数据
 */
const fetchData = async () => {
  const res = await getCheckinOrderList(searchParams);
  orderList.value = res.data.items;
  total.value = res.data.total;
};


const allTableData = ref([]);
/**
 * 获取所有数据(导出用)
 */
const getAllTableData = async () => {
  try {
    const res = await getCheckinOrderList({
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
    fileName: "checkin"
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
 * 处理退房按钮点击事件
 */
const handleCheckout = (row: HotelOrder) => {
  ElMessageBox.confirm(
    "确定要为 [" + row.roomNumber + "] 房间办理退房吗？",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }
  ).then(async () => {
    await checkoutOrder(row.orderId);
    ElMessage.success("退房成功");
    await fetchData();
  });
};

/**
 * 处理刷新按钮点击事件
 */
const handleRefresh = () => {
  searchParams.roomNumber = "";
  searchParams.checkinDate = "";
  searchParams.checkoutDate = "";
  searchParams.pageNum = 1;
  searchParams.pageSize = 9;
  fetchData();
};

/**
 * 格式化日期
 */
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
</script>
