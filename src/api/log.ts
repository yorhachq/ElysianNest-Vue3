import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import type { Result } from "@/api/user";
/**
 * 获取系统日志列表
 */
export function getLogList(params: any) {
  return http.request<Result>("get", baseUrlApi("sysLog"), {
    params
  });
}
