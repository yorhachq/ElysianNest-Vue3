import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import type { Result } from "@/api/user";

// 获取日历房态数据
export function getCalendarData(date?: string) {
  return http.request<Result>(
    "get",
    baseUrlApi("hotelRoomCalendar/monthData"),
    {
      params: { date }
    }
  );
}

// 获取指定日期的可用房间列表
export function getAvailableRooms(date?: string) {
  return http.request<Result>(
    "get",
    baseUrlApi("hotelRoomCalendar/availableRooms"),
    {
      params: { date }
    }
  );
}

// 预订房间
export function reserveRoom(data?: object) {
  return http.request<Result>("post", baseUrlApi("hotelOrder/reserve"), {
    data
  });
}

// 办理入住
export function checkinRoom(data?: object) {
  return http.request<Result>("post", baseUrlApi("hotelOrder/checkin"), {
    data
  });
}
