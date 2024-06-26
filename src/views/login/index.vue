<!--动态路由-->
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { debounce } from "@pureadmin/utils";
import forgetPwd from "@/views/login/components/forgetPwd.vue";
import { useNav } from "@/layout/hooks/useNav";
import { useEventListener } from "@vueuse/core";
import type { FormInstance } from "element-plus";
import { $t, transformI18n } from "@/plugins/i18n";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { initRouter, getTopMenu } from "@/router/utils";
import { bg, avatar, illustration } from "./utils/static";
import {ref, toRaw, reactive, computed, watch} from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import globalization from "@/assets/svg/globalization.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import Check from "@iconify-icons/ep/check";
import User from "@iconify-icons/ri/user-3-fill";
import ReImageVerify from "@/components/ReImageVerify/src/index.vue";

defineOptions({
  name: "Login"
});

const imgCode = ref("");
const router = useRouter();
const loading = ref(false);
const disabled = ref(false);
const ruleFormRef = ref<FormInstance>();
const currentPage = computed(() => {
  return useUserStoreHook().currentPage;
});

const { t } = useI18n();
const { initStorage } = useLayout();
initStorage();
const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title, getDropdownItemStyle, getDropdownItemClass } = useNav();
const { locale, translationCh, translationEn } = useTranslationLang();

const ruleForm = reactive({
  username: "",
  password: "",
  verifyCode: ""
});

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true;
      useUserStoreHook()
        .loginByUsername({
          username: ruleForm.username,
          password: ruleForm.password
        })
        .then(res => {
          if (res.success) {
            // 获取后端路由
            return initRouter().then(() => {
              disabled.value = true;
              router
                .push(getTopMenu(true).path)
                .then(() => {
                  message("登录成功", { type: "success" });
                })
                .finally(() => (disabled.value = false));
            });
          }
        })
        .finally(() => (loading.value = false));
    } else {
      return fields;
    }
  });
};

const immediateDebounce: any = debounce(
  formRef => onLogin(formRef),
  1000,
  true
);

useEventListener(document, "keypress", ({ code }) => {
  if (code === "Enter" && !disabled.value && !loading.value)
    immediateDebounce(ruleFormRef.value);
});

watch(imgCode, value => {
  useUserStoreHook().SET_VERIFYCODE(value);
});

const { VITE_UI_URL } = import.meta.env;
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" alt="bg" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
      <!-- 国际化 -->
      <!--      <el-dropdown trigger="click">-->
      <!--        <globalization-->
      <!--          class="hover:text-primary hover:!bg-[transparent] w-[20px] h-[20px] ml-1.5 cursor-pointer outline-none duration-300"-->
      <!--        />-->
      <!--        <template #dropdown>-->
      <!--          <el-dropdown-menu class="translation">-->
      <!--            <el-dropdown-item-->
      <!--              :style="getDropdownItemStyle(locale, 'zh')"-->
      <!--              :class="['dark:!text-white', getDropdownItemClass(locale, 'zh')]"-->
      <!--              @click="translationCh"-->
      <!--            >-->
      <!--              <IconifyIconOffline-->
      <!--                v-show="locale === 'zh'"-->
      <!--                class="check-zh"-->
      <!--                :icon="Check"-->
      <!--              />-->
      <!--              简体中文-->
      <!--            </el-dropdown-item>-->
      <!--            <el-dropdown-item-->
      <!--              :style="getDropdownItemStyle(locale, 'en')"-->
      <!--              :class="['dark:!text-white', getDropdownItemClass(locale, 'en')]"-->
      <!--              @click="translationEn"-->
      <!--            >-->
      <!--              <span v-show="locale === 'en'" class="check-en">-->
      <!--                <IconifyIconOffline :icon="Check" />-->
      <!--              </span>-->
      <!--              English-->
      <!--            </el-dropdown-item>-->
      <!--          </el-dropdown-menu>-->
      <!--        </template>-->
      <!--      </el-dropdown>-->
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <!--logo标题-->
            <h2 class="outline-none">
              <!--              <TypeIt-->
              <!--                :options="{ strings: [title], cursor: false, speed: 100 }"-->
              <!--              />-->
              {{ title }}
            </h2>
          </Motion>
          <!-- 登录主页面 -->
          <el-form
            v-if="currentPage === 0"
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: transformI18n($t('login.usernameReg')),
                    trigger: 'blur'
                  }
                ]"
                prop="username"
              >
                <el-input
                  v-model="ruleForm.username"
                  clearable
                  :placeholder="t('login.username')"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  autocomplete="new-password"
                  clearable
                  show-password
                  :placeholder="t('login.password')"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <!--图形验证码-->
            <Motion :delay="200">
              <el-form-item prop="verifyCode">
                <el-input
                  v-model="ruleForm.verifyCode"
                  clearable
                  :placeholder="t('login.verifyCode')"
                  :prefix-icon="useRenderIcon('ri:shield-keyhole-line')"
                >
                  <template v-slot:append>
                    <ReImageVerify v-model:code="imgCode" />
                  </template>
                </el-input>
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-form-item>
                <div class="w-full h-[20px] flex justify-between items-center">
                  <el-button link type="primary">
                    <el-link
                      type="primary"
                      :underline="false"
                      :href="VITE_UI_URL"
                      target="_blank"
                      style="padding-bottom: 1px"
                    >
                      {{ t("login.guest") }}
                    </el-link>
                  </el-button>
                  <el-button
                    link
                    type="primary"
                    @click="useUserStoreHook().SET_CURRENTPAGE(4)"
                  >
                    {{ t("login.forget") }}
                  </el-button>
                </div>
                <el-button
                  class="w-full mt-4"
                  size="default"
                  type="primary"
                  :loading="loading"
                  :disabled="disabled"
                  @click="onLogin(ruleFormRef)"
                >
                  {{ t("login.login") }}
                </el-button>
              </el-form-item>
            </Motion>
          </el-form>
          <!-- 忘记密码 -->
          <forget-pwd v-if="currentPage === 4" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}
</style>
