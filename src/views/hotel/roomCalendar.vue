<template>
  <div class="calendar-overview">
    <el-card class="flex flex-col max-h-full">
      <!--页面标题-->
      <template #header>
        <div class="card-header">
          <span class="font-bold text-lg">日历房态</span>
        </div>
      </template>
      <!-- 日历头部 -->
      <div class="calendar-header">
        <div class="header-row bg-gray-200">
          <div v-for="day in weekDays" :key="day" class="header-cell">
            {{ day }}
          </div>
        </div>
      </div>
      <!-- 日历主体 -->
      <div class="calendar-body">
        <div
          v-for="(week, index) in calendarData"
          :key="index"
          class="calendar-row"
        >
          <div
            v-for="date in week"
            :key="date.date"
            class="calendar-cell hover:bg-gray-100"
            :class="{ disabled: date.isPast }"
          >
            <div class="date">
              {{ date.date.split("-")[1] + "-" + date.date.split("-")[2] }}
            </div>
            <el-tag class="available-rooms" type="success" effect="plain">
              剩余房间: {{ date.availableRooms }}
            </el-tag>
            <div v-if="!date.isPast" class="actions">
              <el-button
                plain
                type="primary"
                size="small"
                @click="openReservationDialog(date.date)"
                >预订
              </el-button>
              <el-button
                v-if="isToday(date.date)"
                plain
                type="success"
                size="small"
                @click="openCheckinDialog(date.date)"
                >入住
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 预订对话框 -->
      <reservation-dialog
        v-model="reservationVisible"
        :date="selectedDate"
        @success="fetchCalendarData"
      />

      <!-- 入住对话框 -->
      <checkin-dialog
        v-model="checkinVisible"
        :date="selectedDate"
        @success="fetchCalendarData"
      />
    </el-card>
  </div>
</template>

<script setup>
import { Refresh } from "@element-plus/icons-vue";

defineOptions({
  name: "RoomCalendar"
});
import { ref, onMounted } from "vue";
import { getCalendarData } from "@/api/roomCalendar";
import ReservationDialog from "./components/ReservationDialog.vue";
import CheckinDialog from "./components/CheckinDialog.vue";
import dayjs from "dayjs";

const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const calendarData = ref([]);
const reservationVisible = ref(false);
const checkinVisible = ref(false);
const selectedDate = ref("");

const fetchCalendarData = async () => {
  const today = dayjs().format("YYYY-MM-DD");
  const res = await getCalendarData(today);
  if (res.success) {
    const data = Object.entries(res.data).map(([date, availableRooms]) => ({
      date,
      day: date.slice(-2),
      availableRooms,
      isPast: dayjs(date).isBefore(today, "day")
    }));
    calendarData.value = [];
    for (let i = 0; i < data.length; i += 7) {
      calendarData.value.push(data.slice(i, i + 7));
    }
  }
};

const openReservationDialog = date => {
  selectedDate.value = date;
  reservationVisible.value = true;
};

const openCheckinDialog = date => {
  selectedDate.value = date;
  checkinVisible.value = true;
};

const isToday = date => {
  return dayjs(date).isSame(dayjs(), "day");
};

const isAfterToday = date => {
  return dayjs(date).isAfter(dayjs(), "day");
};
onMounted(() => {
  fetchCalendarData();
});
</script>

<style scoped>
.header-row {
  display: flex;
}

.header-cell {
  flex: 1;
  text-align: center;
  padding: 8px;
  font-weight: bold;
}

.calendar-row {
  display: flex;
}

.calendar-cell {
  flex: 1;
  border: 1px solid #eee;
  padding: 8px;
  text-align: center;
}

.calendar-cell.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.date {
  font-size: 21px;
  font-weight: bold;
}

.available-rooms {
  margin-top: 8px;
  font-size: 14px;
}

.actions {
  margin-top: 16px;
}
</style>
