<template>
  <el-dialog v-model="visible" width="800px">
    <template #header>
      <span class="inline-flex"
        ><h3 class="dialog-title float-left">入住办理</h3>
        <span class="mt-0.5 ml-10 text-gray-500"
          >当前正在办理的日期是：{{ date }}</span
        ></span
      >
    </template>
    <!-- 步骤条 -->
    <el-steps class="mb-4" :active="activeStep" finish-status="success" simple>
      <el-step title="选择会员" />
      <el-step title="入住房间" />
      <el-step title="退房日期" />
      <el-step title="提交订单" />
    </el-steps>

    <!-- 步骤1: 搜索并选择会员 -->
    <div v-if="activeStep === 0">
      <div class="search-form text-center inline-flex w-full">
        <el-input
          v-model="username"
          placeholder="请输入会员名"
          style="margin-right: 16px"
        />
        <el-input
          v-model="phone"
          type="number"
          min="1"
          placeholder="请输入手机号"
          style="margin-right: 16px"
          :controls="false"
        />
        <el-button type="primary" @click="handleMemberSearch">搜索</el-button>
      </div>
      <div class="member-list">
        <el-card
          v-if="memberList !== null && memberList.length > 0"
          class="mt-4"
        >
          <el-descriptions title="会员搜索结果">
            <el-descriptions-item>
              <el-radio-group v-model="selectedMember" size="large">
                <el-radio-button
                  v-for="member in memberList"
                  :key="member.memberId"
                  :label="member"
                >
                  <div style="text-align: left">
                    <div class="mt-1"><b>会员名：</b>{{ member.username }}</div>
                    <div class="mt-1">
                      <b>等级：</b>{{ member.memberLevel }}
                    </div>
                    <div class="mt-1">
                      <b>性别：</b>{{ member.gender === "male" ? "男" : "女" }}
                    </div>
                    <div class="mt-1"><b>手机号：</b>{{ member.phone }}</div>
                    <div class="mt-1">
                      <b>账户余额：</b>¥ {{ member.balance }}
                    </div>
                  </div>
                </el-radio-button>
              </el-radio-group>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>
    </div>

    <!-- 步骤2: 选择房间 -->
    <div v-if="activeStep === 1">
      <div class="room-list mt-4">
        <div v-for="(rooms, floor) in roomsByFloor" :key="floor" class="mb-4">
          <h3 class="text-xl font-bold mb-2">{{ floor }}层</h3>
          <el-radio-group v-model="selectedRoom" size="large">
            <el-radio-button
              v-for="room in rooms"
              :key="room.roomId"
              :label="room"
              border
            >
              <div class="mt-0.5">{{ room.roomNumber }}</div>
              <div class="mt-0.5">{{ room.roomType.typeName }}</div>
              <div class="mt-0.5">¥{{ room.roomType.price }} / 晚</div>
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>

    <!-- 步骤3: 选择时间区间 -->
    <div v-if="activeStep === 2">
      <div class="date-range">
        <div class="checkin-date">
          <span>入住日期:</span>
          <el-date-picker
            v-model="today"
            style="width: 40vh"
            type="date"
            placeholder="入住日期"
            :disabled="true"
            value-format="YYYY-MM-DD"
          />
        </div>
        <div class="checkout-date">
          <span>退房日期:</span>
          <el-date-picker
            v-model="checkoutDate"
            style="width: 40vh"
            type="date"
            placeholder="选择退房日期"
            :disabled-date="disabledDate"
            :shortcuts="dateShortcuts"
            value-format="YYYY-MM-DD"
          />
        </div>
      </div>
    </div>

    <!-- 步骤4: 展示订单概要,提交订单 -->
    <div v-if="activeStep === 3">
      <el-descriptions title="确认订单" :column="2" border>
        <el-descriptions-item label="会员名">
          {{ selectedMember.username }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ selectedMember.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="房间号">
          {{ selectedRoom.roomNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="房型">
          {{ selectedRoom.roomType.typeName }}
        </el-descriptions-item>
        <el-descriptions-item label="入住日期">
          {{ today }}
        </el-descriptions-item>
        <el-descriptions-item label="退房日期">
          {{ checkoutDate }}
        </el-descriptions-item>
        <el-descriptions-item label="入住天数">
          {{ dayCount }} 天
        </el-descriptions-item>
        <el-descriptions-item label="支付金额">
          <span class="text-red-500 text-lg">¥ {{ total }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="footer mt-4 inline-grid justify-items-end w-full">
      <nobr>
        <el-button v-if="activeStep > 0" @click="prevStep">上一步</el-button>
        <el-button
          v-if="activeStep < 3"
          type="primary"
          :disabled="!canNext"
          @click="nextStep"
          >下一步
        </el-button>
        <el-button v-if="activeStep === 3" type="primary" @click="submit"
          >提交订单
        </el-button>
      </nobr>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { getAvailableRooms, checkinRoom } from "@/api/roomCalendar";
import {
  searchMember,
  searchMemberByName,
  searchMemberByPhone
} from "@/api/hotelMember";
import dayjs from "dayjs";
import { ElMessage, ElMessageBox } from "element-plus";

const props = defineProps({
  modelValue: Boolean,
  date: String
});

const emit = defineEmits(["update:modelValue", "success"]);

const visible = computed({
  get: () => props.modelValue,
  set: val => emit("update:modelValue", val)
});

const activeStep = ref(0);
const username = ref("");
const phone = ref("");
const memberList = ref([]);
const selectedMember = ref(null);
const roomList = ref([]);
const selectedRoom = ref(null);
const today = ref(dayjs().format("YYYY-MM-DD"));
const checkoutDate = ref("");
const dayCount = computed(() => {
  return dayjs(checkoutDate.value).diff(today.value, "day");
});
const total = computed(() => {
  if (!selectedRoom.value || !checkoutDate.value) {
    return 0;
  }
  const days = dayjs(checkoutDate.value).diff(today.value, "day");
  return selectedRoom.value.roomType.price * days;
});

const canNext = computed(() => {
  if (activeStep.value === 0) {
    return selectedMember.value !== null;
  } else if (activeStep.value === 1) {
    return selectedRoom.value !== null;
  } else if (activeStep.value === 2) {
    return checkoutDate.value !== null && checkoutDate.value.length > 0;
  }
  return true;
});

// 重置表单数据
const resetForm = () => {
  activeStep.value = 0;
  username.value = "";
  phone.value = "";
  memberList.value = [];
  selectedMember.value = null;
  roomList.value = [];
  selectedRoom.value = null;
  checkoutDate.value = "";
};

const handleMemberSearch = async () => {
  let res;
  if (username.value.trim() !== "" && phone.value.trim() !== "") {
    res = await searchMember({
      username: username.value,
      phone: phone.value
    });
    if (res.success) {
      memberList.value = res.data.items;
    }
  } else if (username.value.trim() !== "") {
    res = await searchMemberByName(username.value);
    if (res.success) {
      memberList.value = res.data.items;
    }
  } else if (phone.value.trim() !== "") {
    res = await searchMemberByPhone(phone.value);
    if (res.success) {
      memberList.value = res.data.items;
    }
  } else {
    memberList.value = [];
  }
  if (res === null || res.data.total === 0) {
    ElMessage.warning("未找到符合搜索条件的会员");
  }
};

const roomsByFloor = computed(() => {
  const groups = {};
  roomList.value.forEach(room => {
    const floor = room.floorNumber;
    if (!groups[floor]) {
      groups[floor] = [];
    }
    groups[floor].push(room);
  });
  return groups;
});

const disabledDate = date => {
  return dayjs(date).isBefore(props.date, "day");
};

const dateShortcuts = [
  {
    text: "明天",
    value: () => dayjs().add(1, "day").toDate()
  },
  {
    text: "后天",
    value: () => dayjs().add(2, "day").toDate()
  },
  {
    text: "一周后",
    value: () => dayjs().add(1, "week").toDate()
  }
];

const prevStep = () => {
  activeStep.value--;
};

const nextStep = () => {
  if (checkoutDate.value === today.value) {
    ElMessage.warning("退房日期不能与入住日期相同");
  } else {
    activeStep.value++;
  }
};

const submit = async () => {
  if (!selectedMember.value) {
    ElMessage.warning("请选择会员");
    return;
  }
  if (!selectedRoom.value) {
    ElMessage.warning("请选择房间");
    return;
  }
  if (!checkoutDate.value) {
    ElMessage.warning("请选择退房日期");
    return;
  }
  ElMessageBox.confirm("确认办理入住吗？", "请仔细核对订单信息", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    const res = await checkinRoom({
      userId: selectedMember.value.userId,
      roomId: selectedRoom.value.roomId,
      checkinDate: today.value,
      checkoutDate: checkoutDate.value
    });
    if (res.success) {
      ElMessage.success("入住办理成功,请关注订单信息");
      emit("success");
      visible.value = false;
    }
  });
};

const fetchRooms = async () => {
  const res = await getAvailableRooms(props.date);
  if (res.success) {
    roomList.value = res.data;
  }
};

watch(
  () => props.modelValue,
  val => {
    if (val) {
      fetchRooms();
    } else {
      resetForm();
    }
  }
);
</script>
<style scoped>
.date-range {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.checkin-date,
.checkout-date {
  display: flex;
  align-items: center;
}

.checkin-date span,
.checkout-date span {
  margin-right: 10px;
}
</style>
