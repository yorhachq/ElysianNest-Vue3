<template>
  <div class="flex flex-col gap-4">
    <el-card>
      <div class="flex items-center">
        <!-- 左侧头像 -->
        <el-avatar :size="60" :src="userInfo.avatar" class="mr-4" />
        <!-- 问候内容 -->
        <div>
          <h2 class="text-xl font-bold">
            {{ greetingMsg.greeting }}，{{ userInfo.username }}，
            {{ greetingMsg.msg }}
          </h2>
          <p class="text-gray-500">{{ userInfo.email }}</p>
        </div>
        <!-- 右侧今日处理事件数 -->
        <div class="ml-auto">
          <el-tag type="success" size="large" style="font-size: medium"
            >今日已处理事件数：
            <el-tag effect="dark" type="success">
              {{ taskCount }}
            </el-tag>
          </el-tag>
        </div>
      </div>
      <template #footer>
        <!-- 天气模块 -->
        <p class="text-gray-500 text-center">
          {{ weatherData.location }}，天气：
          <i :class="'qi-' + weatherData.icon" />
          {{ weatherData.weather }}， 当前气温：{{
            weatherData.temperature
          }}°C， 体感温度：{{ weatherData.feelsLike }}°C， 风向：{{
            weatherData.windDirection
          }}， 空气质量：{{ weatherData.air }}
        </p>
      </template>
    </el-card>

    <!-- 个人信息模块 -->
    <el-card>
      <el-descriptions
        class="margin-top"
        :column="3"
        title="个人信息"
        :size="size"
        border
      >
        <template #extra>
          <el-button type="primary" @click="openEditDialog">编辑资料</el-button>
          <el-button type="primary" @click="openDialog">修改密码</el-button>
          <UpdatePwd ref="updatePwdRef" />
        </template>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <user />
              </el-icon>
              用户名
            </div>
          </template>
          {{ userInfo.username }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <male />
              </el-icon>
              性别
            </div>
          </template>
          {{ gender }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <iphone />
              </el-icon>
              手机号
            </div>
          </template>
          {{ userInfo.phone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <location />
              </el-icon>
              邮箱
            </div>
          </template>
          {{ userInfo.email }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <tickets />
              </el-icon>
              角色
            </div>
          </template>
          <el-tag size="default">{{ role }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <timer />
              </el-icon>
              账户创建时间
            </div>
          </template>
          {{ createTime }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <!-- 编辑资料对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑资料">
      <el-form
        :model="editUserInfo"
        :rules="rules"
        ref="editUserForm"
        label-width="80px"
      >
        <el-form-item label="头像">
          <!--          <el-button-->
          <!--            type="success"-->
          <!--            :icon="Upload"-->
          <!--            size="large"-->
          <!--            @click="uploadAvatar"-->
          <!--          >-->
          <!--            上传头像-->
          <!--          </el-button>-->
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :headers="{ Authorization: getToken().accessToken }"
            :auto-upload="true"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="editUserInfo.avatar"
              :src="editUserInfo.avatar"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" disabled />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editUserInfo.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserInfo.email" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEdit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 快速操作 -->
    <el-card class="quick-actions">
      <template #header>
        <div class="card-header">
          <span>快速操作</span>
        </div>
      </template>
      <!-- 四个按钮 -->
      <div class="quick-buttons">
        <el-card
          shadow="hover"
          class="items-center flex flex-col justify-center"
          style="width: 210px; height: 180px; text-align: center"
          @click="$router.push('/')"
        >
          <IconifyIconOnline
            icon="icon-park-outline:home"
            width="60px"
            height="60px"
          />
          <template #footer
            ><h2 class="text-xl font-light text-center">首页</h2></template
          >
        </el-card>
        <el-card
          shadow="hover"
          class="items-center flex flex-col justify-center"
          style="width: 210px; height: 180px; text-align: center"
          @click="$router.push('/hotel/room')"
        >
          <IconifyIconOnline
            icon="icon-park-outline:hotel"
            width="60px"
            height="60px"
          />
          <template #footer
            ><h2 class="text-xl font-light text-center">房间管理</h2></template
          >
        </el-card>
        <el-card
          shadow="hover"
          class="items-center flex flex-col justify-center"
          style="width: 210px; height: 180px; text-align: center"
          @click="$router.push('/hotel/order')"
        >
          <IconifyIconOnline
            icon="icon-park-outline:order"
            width="60px"
            height="60px"
          />
          <template #footer
            ><h2 class="text-xl font-light text-center">订单管理</h2></template
          >
        </el-card>
        <el-card
          shadow="hover"
          class="items-center flex flex-col justify-center"
          style="width: 210px; height: 180px; text-align: center"
          @click="$router.push('/personnel/member')"
        >
          <IconifyIconOnline
            icon="icon-park-outline:vip-one"
            width="60px"
            height="60px"
          />
          <template #footer
            ><h2 class="text-xl font-light text-center">会员管理</h2></template
          >
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from "vue";
import {
  getWeather,
  getUserInfo,
  updateUserInfo,
  updateAvatar
} from "@/api/user";
// 本地引入天气图标
import "@/assets/weatherfont/qweather-icons.css";

import {
  Iphone,
  Location,
  Male,
  Tickets,
  User,
  Timer,
  Plus
} from "@element-plus/icons-vue";
import { useUserStoreHook } from "@/store/modules/user";
import { message } from "@/utils/message";
import { getToken } from "@/utils/auth";
import UpdatePwd from "@/views/space/components/updatePwd.vue";

const editUserForm = ref(null);

const rules = reactive({
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1\d{10}$/, message: "手机号格式不正确", trigger: "blur" }
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: "blur" }
  ]
});

const updatePwdRef = ref();
const openDialog = () => {
  updatePwdRef.value.open();
};

const size = ref("default");
const iconStyle = computed(() => {
  const marginMap = {
    large: "8px",
    default: "6px",
    small: "4px"
  };
  return {
    marginRight: marginMap[size.value] || marginMap.default
  };
});
const blockMargin = computed(() => {
  const marginMap = {
    large: "32px",
    default: "28px",
    small: "24px"
  };
  return {
    marginTop: marginMap[size.value] || marginMap.default
  };
});
const taskCount = ref(0);

interface WeatherData {
  location: string;
  weather: string;
  temperature: string;
  feelsLike: string;
  windDirection: string;
  air: string;
}

const roleCode = ref(useUserStoreHook()?.roles[0]);
const role = ref();

const userInfo = reactive({
  username: "username",
  email: "username@example.com",
  avatar: "",
  gender: "",
  phone: "",
  createTime: ""
});

const weatherData = reactive<WeatherData>({
  location: "赣州市",
  weather: "多云",
  temperature: "26",
  feelsLike: "29",
  windDirection: "西南风",
  air: "优"
});

const greetingMsg = reactive({
  greeting: "",
  msg: ""
});

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 5 || hour > 23) {
    // 23~5点
    greetingMsg.greeting = "晚上好";
    greetingMsg.msg = "夜深了，注意休息哦！";
  } else if (hour < 6) {
    // 5~6点
    greetingMsg.greeting = "凌晨好";
    greetingMsg.msg = "早起的鸟儿有虫吃！";
  } else if (hour < 8) {
    // 6~8点
    greetingMsg.greeting = "早上好";
    greetingMsg.msg = "开始您一天的工作吧！";
  } else if (hour < 12) {
    // 8~12点
    greetingMsg.greeting = "上午好";
    greetingMsg.msg = "开始您一天的工作吧！";
  } else if (hour < 14) {
    // 12~14点
    greetingMsg.greeting = "中午好";
    greetingMsg.msg = "中午小睡，下午精神百倍！";
  } else if (hour < 19) {
    // 14~19点
    greetingMsg.greeting = "下午好";
    greetingMsg.msg = "继续努力工作吧！";
  } else {
    // 19~23点
    greetingMsg.greeting = "晚上好";
    greetingMsg.msg = "皎洁月光伴你同行！";
  }
};

const fetchWeatherData = async () => {
  try {
    const result = await getWeather();
    Object.assign(weatherData, result.data);
  } catch (error) {
    console.error("获取天气数据失败:", error);
  }
};
let createTime = ref("");
let gender = ref("");
const fetchUserInfo = async () => {
  try {
    const result = await getUserInfo();
    Object.assign(userInfo, result.data);
    switch (roleCode.value) {
      case "admin":
        role.value = "超级管理员";
        break;
      case "common":
        role.value = "酒店前台";
        break;
      default:
        role.value = "未知";
        break;
    }
    switch (userInfo.gender) {
      case "male":
        gender.value = "男";
        break;
      case "female":
        gender.value = "女";
        break;
      default:
        gender.value = "未知";
    }
    // 把2024-03-26T11:02:12的格式转换为2024/3/26日
    createTime.value = new Date(userInfo.createTime).toLocaleDateString();
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
};
const editDialogVisible = ref(false);
const editUserInfo = reactive({
  email: "",
  avatar: "",
  gender: "",
  phone: ""
});

const openEditDialog = () => {
  // 打开编辑对话框时,将当前用户信息填入表单
  Object.assign(editUserInfo, userInfo);
  editDialogVisible.value = true;
};

const handleAvatarSuccess = response => {
  // 上传头像成功后的回调
  editUserInfo.avatar = response.data;
};

const beforeAvatarUpload = rawFile => {
  // 上传头像前的校验
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    message("上传头像图片只能是 JPG 或 PNG 格式!", { type: "error" });
    return false;
  } else if (rawFile.size / 1024 / 1024 > 5) {
    message("上传头像图片大小不能超过 5MB!", { type: "error" });
    return false;
  }
  return true;
};

const submitEdit = async () => {
  editUserForm.value.validate(async valid => {
    if (valid) {
      try {
        // 将中文的性别值转换为后端需要的格式
        editUserInfo.gender = gender.value === "男" ? "male" : "female";
        await updateUserInfo(editUserInfo);
        await updateAvatar(editUserInfo);
        // 修改pinia中的数据
        useUserStoreHook().avatar = editUserInfo.avatar;
        // 更新页面上显示的用户信息
        Object.assign(userInfo, editUserInfo);
        message("资料修改成功", { type: "success" });
        editDialogVisible.value = false;
      } catch (error) {
        console.error("修改用户信息失败:", error);
        message("修改失败,请稍后重试", { type: "error" });
      }
    }
  });
};

// const uploadAvatar = async () => {
//   const result = await updateAvatar(editUserInfo);
//   const { success } = result;
//   if (success === true) {
//     // 检查后端返回的code是否为0
//     message("头像更换成功！", { type: "success" });
//     // 修改pinia中的数据
//     useUserStoreHook().avatar = editUserInfo.avatar;
//   } else {
//     message("头像更换失败！", { type: "error" });
//   }
// };

onMounted(() => {
  greeting();
  fetchWeatherData();
  fetchUserInfo();
});
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.quick-buttons {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}

.quick-buttons .el-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
}

.quick-buttons img {
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
}
</style>
