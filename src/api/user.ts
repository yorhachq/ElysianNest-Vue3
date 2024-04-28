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

export const getUserInfoById = (id?: number) => {
  return http.request<UserResult>("get", baseUrlApi(`sysUser/userInfo/${id}`));
};

/** 更新用户信息 */
export const updateUserInfo = (data?: object) => {
  return http.request<Result>("put", baseUrlApi("sysUser/update"), {
    data
  });
};

/** 发送邮箱验证码 */
export const sendEmailCodeService = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("sysUser/sendVerifyEmail"), {
    data
  });
};

/** 重置密码 */
export const resetPwdService = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("sysUser/resetPwd"), { data });
};

/** 修改密码 */
export const updatePwdService = (data?: object) => {
  return http.request<Result>("patch", baseUrlApi("sysUser/updatePwd"), {
    data
  });
};

/** 管理员更新用户密码 */
export const updatePwdByAdmin = (data?: object) => {
  return http.request<Result>("patch", baseUrlApi("sysUser/updatePwdByAdmin"), {
    data
  });
};

/** 修改头像 */
export const updateAvatar = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("sysUser/updateAvatar"), {
    data
  });
};

/** 退出登录(通过后端销毁Redis中的两个token) */
export const logout = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("sysUser/logout"), { data });
};

/** 获取客户端IP归属地 */
export const getIpRegion = (data?: object) => {
  return http.request<Result>("get", baseUrlApi("ip/region"), {
    data
  });
};

/** 获取实时天气 */
export const getWeather = (data?: object) => {
  return http.request<Result>("get", baseUrlApi("/sysUser/weather"), {
    data
  });
};

/** 员工注册 */
export const registerUser = (params?: object) => {
  return http.request<Result>("post", baseUrlApi("sysUser/register"), {
    params
  });
};

/** 获取员工列表 */
export const getUserList = (params?: object) => {
  return http.request<Result>("get", baseUrlApi("sysUser/list"), {
    params
  });
};

/**
 * 更新员工信息
 */
export function updateUserByAdmin(data: object) {
  return http.request<Result>("put", baseUrlApi("sysUser/updateByAdmin"), {
    data
  });
}

/**
 * 删除员工
 */
export function deleteUser(userId: number) {
  return http.request<Result>("delete", baseUrlApi(`sysUser/delete/${userId}`));
}

/**
 * 获取角色列表
 */
export function getRoleList() {
  return http.request<Result>("get", baseUrlApi("sysUser/roles"));
}
