import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import type { Result } from "@/api/user";

export interface HotelOrder {
  orderId: number;
  userId: number;
  roomId: number;
  roomNumber: number;
  orderNum: string;
  reserveDate: string;
  checkinDate: string;
  checkoutDate: string;
  status: string;
  payment: number;
  createTime: string;
  updateTime: string;
  username: string;
  phone: string;
  gender: string;
  typeName: string;
  days: number;
}

// 查询酒店订单列表
export function getHotelOrderList(params: any) {
  return http.request<Result>("get", baseUrlApi("hotelOrder/orderList"), {
    params
  });
}

// 查询入住订单列表
export function getCheckinOrderList(params: any) {
  return http.request<Result>("get", baseUrlApi("hotelOrder/checkinList"), {
    params
  });
}

// 办理入住
export function checkinOrder(data: object) {
  return http.request<Result>("post", baseUrlApi("hotelOrder/checkin"), {
    data
  });
}

// 办理退房
export function checkoutOrder(orderId: number) {
  return http.request<Result>(
    "put",
    baseUrlApi("hotelOrder/checkout/" + orderId)
  );
}

// 取消订单
export function cancelOrder(orderId: number) {
  return http.request<Result>(
    "put",
    baseUrlApi("hotelOrder/cancel/" + orderId)
  );
}
