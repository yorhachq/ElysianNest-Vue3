import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import type { Result } from "@/api/user";

// 房间类型接口
export interface Room {
  roomId: number;
  roomNumber: number;
  floorNumber: number;
  roomTypeId: number;
  roomTypeName: string;
  status: string;
  createTime: string;
  updateTime: string;
}

// 添加房间
export function addRoom(data?: Room) {
  http.request<Result>("post", baseUrlApi("hotelRoom"), {
    data
  });
}

// 更新房间
export function updateRoom(data?: Room) {
  return http.request<Result>("put", baseUrlApi("hotelRoom"), {
    data
  });
}

// 删除房间
export function deleteRoom(id: number) {
  return http.request<Result>("delete", baseUrlApi("hotelRoom/" + id));
}

// 获取房间列表
export function getRoomList(params: any) {
  return http.request<Result>("get", baseUrlApi("hotelRoom"), {
    params
  });
}
