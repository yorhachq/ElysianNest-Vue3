import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import type { Result } from "@/api/user";

export interface RoomType {
  roomTypeId: number;
  typeName: string;
  price: number;
  image: string;
  description: string;
  status: string;
  createTime: string;
  updateTime: string;
}

// 添加房间类型
export function addRoomType(data?: RoomType) {
  return http.request<Result>("post", baseUrlApi("/hotelRoomType"), {
    data
  });
}

// 更新房间类型
export function updateRoomType(data?: RoomType) {
  return http.request<Result>("put", baseUrlApi("/hotelRoomType"), {
    data
  });
}

// 删除房间类型
export function deleteRoomType(id: number) {
  return http.request<Result>("delete", baseUrlApi("/hotelRoomType/" + id));
}

// 分页查询房间类型
export function getRoomTypeList(params: any) {
  return http.request<Result>("get", baseUrlApi("/hotelRoomType"), {
    params
  });
}
