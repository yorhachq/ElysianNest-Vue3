import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import type { Result } from "@/api/user";

// 搜索会员
export function searchMember(data?: object) {
  return http.request<Result>(
    "get",
    baseUrlApi(
      "hotelMember/getmembers?username=" +
        data.username +
        "&phone=" +
        data.phone
    )
  );
}

export function searchMemberByName(keyword?: string) {
  return http.request<Result>(
    "get",
    baseUrlApi("hotelMember/getmembers?username=" + keyword)
  );
}

export function searchMemberByPhone(keyword?: string) {
  return http.request<Result>(
    "get",
    baseUrlApi("hotelMember/getmembers?phone=" + keyword)
  );
}

// 会员注册
export function addMember(params?: object) {
  return http.request<Result>("post", baseUrlApi("hotelMember/register"), {
    params
  });
}

//会员登录
export function loginMember(data?: object) {
  return http.request<Result>("post", baseUrlApi("hotelMember/login"), {
    data
  });
}

// 获取会员列表
export function getMemberList(params?: object) {
  return http.request<Result>("get", baseUrlApi("hotelMember/getmembers"), {
    params
  });
}

// 获取会员详情
export function getMemberInfo(id?: number) {
  return http.request<Result>("get", baseUrlApi(`hotelMember/info/${id}`));
}

// 更新会员信息(管理员)
export function updateMember(data?: object) {
  return http.request<Result>("put", baseUrlApi("sysUser/updateByAdmin"), {
    data
  });
}

// 删除会员
export function deleteMember(id?: number) {
  return http.request<Result>("delete", baseUrlApi(`hotelMember/delete/${id}`));
}

//会员充值
export function rechargeMember(data?: object) {
  return http.request<Result>("post", baseUrlApi("hotelMember/recharge"), {
    data
  });
}
