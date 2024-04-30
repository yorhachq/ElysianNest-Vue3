<template>
  <el-dialog v-model="visible" width="800px">
    <template #header>
      <span class="inline-flex"
        ><h3 class="dialog-title float-left">客房预订</h3>
        <span class="mt-0.5 ml-10 text-gray-500"
          >当前正在办理的日期是：{{ date }}</span
        ></span
      >
    </template>
    <!-- 步骤条 -->
    <el-steps class="mb-4" :active="activeStep" finish-status="success" simple>
      <el-step title="选择会员" />
      <el-step title="确定日期" />
      <el-step title="预订房间" />
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

    <!-- 步骤2: 选择时间区间 -->
    <div v-if="activeStep === 1">
      <div class="date-range w-full text-center">
        <el-date-picker
          v-model="dateRange"
          style="width: 100vh"
          type="daterange"
          range-separator="至"
          start-placeholder="入住日期"
          end-placeholder="退房日期"
          :disabled-date="disabledDate"
          :shortcuts="dateShortcuts"
          :clearable="false"
        />
      </div>
    </div>

    <!-- 步骤3: 选择房间 -->
    <div v-if="activeStep === 2">
      <div v-if="roomList.length > 0" class="room-list mt-4">
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
      <div v-else class="text-center text-gray-500">
        当前日期区间没有可用房间,请重新选择日期
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
          {{ dateRange[0].toLocaleDateString().replaceAll("/", "-") }}
        </el-descriptions-item>
        <el-descriptions-item label="退房日期">
          {{ dateRange[1].toLocaleDateString().replaceAll("/", "-") }}
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
import { getAvailableRooms, reserveRoom } from "@/api/roomCalendar";
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
const dateRange = ref([]);
const dayCount = computed(() => {
  return dayjs(dateRange.value[1]).diff(dateRange.value[0], "day");
});
const total = computed(() => {
  const days = dayjs(dateRange.value[1]).diff(dateRange.value[0], "day");
  return selectedRoom.value.roomType.price * days;
});

const canNext = computed(() => {
  if (activeStep.value === 0) {
    return selectedMember.value !== null;
  } else if (activeStep.value === 1) {
    return dateRange.value.length === 2;
  } else if (activeStep.value === 2) {
    return selectedRoom.value !== null;
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
  dateRange.value = [];
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
    text: "今天",
    value: () => [dayjs(props.date).toDate(), dayjs(props.date).toDate()]
  },
  {
    text: "明天",
    value: () => [
      dayjs(props.date).add(1, "day").toDate(),
      dayjs(props.date).add(1, "day").toDate()
    ]
  },
  {
    text: "一周",
    value: () => [
      dayjs(props.date).toDate(),
      dayjs(props.date).add(1, "week").toDate()
    ]
  }
];

const prevStep = () => {
  activeStep.value--;
};

const nextStep = async () => {
  if (
    activeStep.value === 1 && dateRange.value.length > 0
      ? dateRange.value[0].toLocaleDateString() ===
        dateRange.value[1].toLocaleDateString()
      : false
  ) {
    ElMessage.warning("退房日期不能与入住日期相同");
  } else {
    if (activeStep.value === 1) {
      // 选择日期区间后,获取可用房间列表
      await fetchRooms();
    }
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
  if (!dateRange.value.length) {
    ElMessage.warning("请选择入住日期和退房日期");
    return;
  }
  ElMessageBox.confirm("确认进行预订吗？", "请仔细核对订单信息", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    const res = await reserveRoom({
      userId: selectedMember.value.userId,
      roomId: selectedRoom.value.roomId,
      checkinDate: dateRange.value[0],
      checkoutDate: dateRange.value[1]
    });
    if (res.success) {
      ElMessage.success("预订成功,请关注订单信息");
      emit("success");
      visible.value = false;
    }
  });
};

const fetchRooms = async () => {
  if (dateRange.value.length === 2) {
    const checkinDate = dayjs(dateRange.value[0]).format("YYYY-MM-DD");
    const checkoutDate = dayjs(dateRange.value[1]).format("YYYY-MM-DD");
    const res = await getAvailableRooms({
      checkinDate,
      checkoutDate
    });
    if (res.success) {
      roomList.value = res.data;
    }
  }
};

watch(
  () => props.modelValue,
  val => {
    if (val) {
      resetForm();
    }
  }
);
</script>
