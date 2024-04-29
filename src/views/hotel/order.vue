<template>
  <div class="order-management">
    <el-card class="flex flex-col max-h-full">
      <template #header>
        <div class="header">
          <span class="font-bold text-lg">订单管理</span>
          <div class="float-end">
            <!--展开/折叠按钮-->
            <el-button
              type="primary"
              :icon="searchFormExpanded ? ArrowUp : ArrowDown"
              @click="searchFormExpanded = !searchFormExpanded"
            >
              {{ searchFormExpanded ? "折叠搜索面板" : "展开搜索面板" }}
            </el-button>
            <!--刷新按钮-->
            <!--                        <el-button-->
            <!--                          type="text"-->
            <!--                          :icon="Refresh"-->
            <!--                          circle-->
            <!--                          style="margin-left: 10px"-->
            <!--                          @click="resetSearch"-->
            <!--                        />-->
          </div>
        </div>
      </template>
      <!--可折叠的搜索表单-->
      <el-collapse-transition class="w-full">
        <div v-show="searchFormExpanded" class="float-start flex">
          <el-form
            :inline="true"
            :model="searchForm"
            class="search-form grid grid-cols-4 justify-items-end"
          >
            <el-form-item label="订单号">
              <el-input
                v-model="searchForm.orderNum"
                placeholder="请输入订单号"
                style="width: 13rem"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select
                v-model="searchForm.status"
                placeholder="请选择订单状态"
                style="width: 13rem"
                @change="handleSearch"
              >
                <el-option label="全部" value="" />
                <el-option label="已预订" value="已预订" />
                <el-option label="入住中" value="入住中" />
                <el-option label="已退房" value="已退房" />
                <el-option label="已取消" value="已取消" />
              </el-select>
            </el-form-item>
            <el-form-item label="房间号">
              <el-input
                v-model="searchForm.roomNumber"
                type="number"
                min="1"
                :controls="false"
                placeholder="请输入房间号"
                clearable
                style="width: 13rem"
                @keyup.enter="handleSearch"
              />
            </el-form-item>

            <el-form-item label="会员名">
              <el-input
                v-model="searchForm.username"
                placeholder="请输入会员名"
                clearable
                style="width: 13rem"
                @keyup.enter="handleSearch"
              />
            </el-form-item>

            <el-form-item label="预订日期">
              <el-date-picker
                v-model="searchForm.reserveDate"
                type="date"
                placeholder="请选择预订日期"
                value-format="YYYY-MM-DD"
                @change="handleSearch"
              />
            </el-form-item>
            <el-form-item label="入住日期">
              <el-date-picker
                v-model="searchForm.checkinDate"
                type="date"
                placeholder="请选择入住日期"
                value-format="YYYY-MM-DD"
                @change="handleSearch"
              />
            </el-form-item>
            <el-form-item label="退房日期">
              <el-date-picker
                v-model="searchForm.checkoutDate"
                type="date"
                placeholder="请选择退房日期"
                value-format="YYYY-MM-DD"
                @change="handleSearch"
              />
            </el-form-item>

            <el-form-item label="手机号">
              <el-input
                v-model="searchForm.phone"
                placeholder="请输入手机号"
                clearable
                style="width: 13rem"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item label="下单时间" class="col-span-2">
              <el-date-picker
                v-model="searchForm.createTimeRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                style="width: 35rem"
                @change="handleSearch"
              />
            </el-form-item>
            <el-form-item class="col-span-2">
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>

      <!--数据表格-->
      <el-table
        :data="orderList"
        height="calc(84vh - 173px)"
        max-height="70vh"
        stripe
        border
      >
        <el-table-column
          type="index"
          label="序号"
          width="53"
          align="center"
          :resizable="false"
        />
        <el-table-column
          prop="orderNum"
          label="订单号"
          width="134"
          align="center"
          :resizable="false"
          sortable
        />
        <el-table-column
          prop="roomNumber"
          label="房间号"
          width="91"
          align="center"
          :resizable="false"
          sortable
        />
        <el-table-column
          prop="typeName"
          label="房型"
          width="100"
          align="center"
          :resizable="false"
        />
        <el-table-column
          prop="username"
          label="会员名"
          width="94"
          align="center"
          :resizable="false"
        />
        <!--        <el-table-column prop="gender" label="性别" width="54" align="center">-->
        <!--          <template #default="scope">-->
        <!--            {{ scope.gender === "male" ? "男" : "女" }}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column
          prop="status"
          label="订单状态"
          width="81"
          align="center"
          :resizable="false"
        >
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="reserveDate"
          label="预订日期"
          width="105"
          align="center"
          :resizable="false"
          sortable
        />
        <el-table-column
          prop="days"
          label="天数"
          width="77"
          align="center"
          :resizable="false"
          sortable
        >
          <template #default="scope"> {{ scope.row.days }} 天</template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="下单时间"
          width="200"
          align="center"
          :resizable="false"
          sortable
        >
          <template #default="scope">
            {{ scope.row.createTime.replaceAll("T", " ") }}
          </template>
        </el-table-column>
        <!--        <el-table-column-->
        <!--          prop="checkinDate"-->
        <!--          label="入住日期"-->
        <!--          width="105"-->
        <!--          align="center"-->
        <!--          :resizable="false"-->
        <!--          sortable-->
        <!--        />-->
        <!--        <el-table-column-->
        <!--          prop="checkoutDate"-->
        <!--          label="退房日期"-->
        <!--          width="105"-->
        <!--          align="center"-->
        <!--          :resizable="false"-->
        <!--          sortable-->
        <!--        />-->

        <el-table-column
          prop="payment"
          label="支付金额"
          width="105"
          align="center"
          :resizable="false"
          sortable
        >
          <template #default="scope"> ¥ {{ scope.row.payment }}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="206"
          align="center"
          :resizable="false"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.status === '已预订'"
              type="success"
              link
              @click="handleCheckinOrder(scope.row)"
            >
              入住
            </el-button>
            <el-button type="primary" link @click="viewDetail(scope.row)"
              >查看详情
            </el-button>
            <el-button
              v-if="
                scope.row.status !== '已退房' && scope.row.status !== '已取消'
              "
              type="danger"
              link
              @click="handleCancelOrder(scope.row.orderId)"
            >
              取消订单
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
          :page-size="searchForm.pageSize"
          :current-page="searchForm.pageNum"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" title="订单详情" width="50%">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号"
          >{{ currentOrder.orderNum }}
        </el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusType(currentOrder.status)">
            {{ currentOrder.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="房间号"
          >{{ currentOrder.roomNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="房间类型"
          >{{ currentOrder.typeName }}
        </el-descriptions-item>
        <el-descriptions-item label="预订日期"
          >{{ currentOrder.reserveDate }}
        </el-descriptions-item>
        <el-descriptions-item label="入住日期"
          >{{ currentOrder.checkinDate }}
        </el-descriptions-item>
        <el-descriptions-item label="退房日期"
          >{{ currentOrder.checkoutDate }}
        </el-descriptions-item>
        <el-descriptions-item label="入住天数"
          >{{ currentOrder.days }} 天
        </el-descriptions-item>
        <el-descriptions-item label="下单会员"
          >{{ currentOrder.username }}
        </el-descriptions-item>
        <el-descriptions-item label="联系方式"
          >{{ currentOrder.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="会员性别"
          >{{ currentOrder.gender === "male" ? "男" : "女" }}
        </el-descriptions-item>
        <el-descriptions-item label="支付金额"
          ><span class="text-red-500">¥ {{ currentOrder.payment }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间"
          >{{ currentOrder.createTime.replaceAll("T", " ") }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间"
          >{{ currentOrder.updateTime.replaceAll("T", " ") }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Order"
});
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ArrowUp, ArrowDown } from "@element-plus/icons-vue";
import {
  getHotelOrderList,
  cancelOrder,
  checkinOrder,
  HotelOrder
} from "@/api/hotelOrder";
import { Refresh } from "@element-plus/icons-vue";

const orderList = ref<HotelOrder[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const currentOrder = ref({});
const searchFormExpanded = ref(false); // 控制搜索表单的展开/折叠状态
const searchForm = reactive({
  createTimeRange: [],
  reserveDate: "",
  checkinDate: "",
  checkoutDate: "",
  status: "",
  orderNum: "",
  username: "",
  phone: "",
  roomNumber: "",
  pageNum: 1,
  pageSize: 9
});

const fetchOrderList = async () => {
  // 保存组件原生的createTimeRange
  const createTimeRange = searchForm.createTimeRange;
  // 格式化createTimeRange参数
  if (searchForm.createTimeRange && searchForm.createTimeRange.length === 2) {
    searchForm.createTimeRange = searchForm.createTimeRange.join(",");
  } else {
    searchForm.createTimeRange = "";
  }
  const res = await getHotelOrderList(searchForm);
  searchForm.createTimeRange = createTimeRange;
  orderList.value = res.data.items;
  total.value = res.data.total;
};

/**
 * 处理分页大小变化事件
 */
const handleSizeChange = (val: number) => {
  searchForm.pageSize = val;
  fetchOrderList();
};

/**
 * 处理页码变化事件
 */
const handlePageChange = (val: number) => {
  searchForm.pageNum = val;
  fetchOrderList();
};

const handleSearch = () => {
  searchForm.pageNum = 1;
  fetchOrderList();
};

const resetSearch = () => {
  searchForm.createTimeRange = [];
  searchForm.reserveDate = "";
  searchForm.checkinDate = "";
  searchForm.checkoutDate = "";
  searchForm.status = "";
  searchForm.orderNum = "";
  searchForm.username = "";
  searchForm.phone = "";
  searchForm.roomNumber = "";
  searchForm.pageNum = 1;
  searchForm.pageSize = 10;
  fetchOrderList();
};

const viewDetail = (order: any) => {
  currentOrder.value = order;
  dialogVisible.value = true;
};

const handleCheckinOrder = async (order: any) => {
  try {
    await ElMessageBox.confirm("确认办理入住吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });
    await checkinOrder({
      orderId: order.orderId,
      userId: order.userId,
      roomId: order.roomId,
      reserveDate: order.reserveDate,
      checkinDate: order.checkinDate,
      checkoutDate: order.checkoutDate
    });
    ElMessage.success("办理入住成功");
    await fetchOrderList();
  } catch (error) {}
};

const handleCancelOrder = async (orderId: number) => {
  try {
    await ElMessageBox.confirm("确认取消该订单吗?取消订单将全额", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });
    await cancelOrder(orderId);
    ElMessage.success("订单取消成功");
    await fetchOrderList();
  } catch (error) {}
};

/**
 * 获取订单状态对应的标签类型
 */
const getStatusType = (status: string) => {
  switch (status) {
    case "已预订":
      return "warning";
    case "入住中":
      return "success";
    case "已退房":
      return "info";
    case "已取消":
      return "danger";
    default:
      return "";
  }
};

onMounted(() => {
  fetchOrderList();
});
</script>

<style scoped>
.search-form {
  margin-bottom: 20px;
}

/* 折叠过渡效果样式 */
el-collapse-transition {
  transition: height 0.3s ease-in-out;
}
</style>
