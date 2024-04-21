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
