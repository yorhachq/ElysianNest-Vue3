import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

// 定义接口返回值类型
export type UserResult = {
  success: boolean;
  data: {
    /** 用户名 */
    username: string;
    /** 当前登陆用户的角色 */
    roles: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type Result = {
  success: boolean;
  message: string;
  data: {};
};

/** 登录 */
export const getLogin = (params?: object) => {
  return http.request<UserResult>("post", baseUrlApi("sysUser/login"), {
    params
  });
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>(
    "post",
    baseUrlApi("sysUser/refresh-token"),
    {
      data
    }
  );
};

/** 获取用户信息 */
export const getUserInfo = () => {
  return http.request<UserResult>("get", baseUrlApi("sysUser/userInfo"));
};

/** 发送邮箱验证码 */
export const sendEmailCodeService = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("sysUser/sendVerifyEmail"), {
    data
  });
};

/** 重置密码 */
export const resetPwdService = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("sysUser/resetPwd"), {
    data
  });
};
