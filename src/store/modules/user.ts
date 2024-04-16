import { defineStore } from "pinia";
import { store } from "@/store";
import type { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageLocal } from "@pureadmin/utils";
import { getLogin, logout, refreshTokenApi } from "@/api/user";
import type { UserResult, RefreshTokenResult } from "@/api/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import {
  type DataInfo,
  setToken,
  removeToken,
  userKey,
  getRefreshToken,
  getToken
} from "@/utils/auth";
import { message } from "@/utils/message";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 用户名
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
    // 页面级别权限
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    // 用户头像
    avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
    // 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
    currentPage: 0,
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7
  }),
  actions: {
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储登录页面显示哪个组件 */
    SET_CURRENTPAGE(value: number) {
      this.currentPage = value;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        data.username = data.username.trim();
        getLogin(data)
          .then(data => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 退出登录（调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      // 后端登出(必须先执行，否则cookies清除后就获取不到token了)
      const accessToken = getToken().accessToken;
      const refreshToken = getRefreshToken();
      const data = {
        accessToken: accessToken,
        refreshToken: refreshToken
      };
      logout(data);
      // 前端删除
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      message("已退出登录", { type: "success" });
      router.push("/login");
    },
    /**
     * 仅用于配合拦截Guest，比常规登出少了信息提示和路由跳转
     * 注意：若本次拦截的用户已登录用户前台，也会在本方法执行后退出登录
     */
    throwBack() {
      this.username = "";
      this.roles = [];
      // 后端登出(被重定向前已经在后端登录了，后端拦截器是在获取动态路由时触发的，所以被重定向后也要清空后端登录状态)
      const accessToken = getToken().accessToken;
      const refreshToken = getRefreshToken();
      const data = {
        accessToken: accessToken,
        refreshToken: refreshToken
      };
      logout(data);
      // 前端删除
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  },
  persist: true
});

export function useUserStoreHook() {
  return useUserStore(store);
}
