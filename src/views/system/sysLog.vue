<template>
  <div class="log-container">
    <el-card class="flex flex-col max-h-full">
      <!--页面标题-->
      <template #header>
        <div class="card-header mt-1">
          <span class="font-bold text-lg">系统日志</span>
          <div class="float-end">
            <!--刷新按钮-->
            <el-button
              type="text"
              :icon="Refresh"
              circle
              style="margin-left: 10px"
              @click="handleRefresh"
            />
          </div>
          <div class="float-end -mb-4">
            <!--筛选表单-->
            <el-form :inline="true" :model="searchParams">
              <el-form-item>
                <el-input
                  v-model="searchParams.username"
                  placeholder="请输入操作人用户名查询"
                  clearable
                  style="width: 180px"
                  @clear="fetchData"
                  @keyup.enter="fetchData"
                />
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="searchParams.roleCode"
                  placeholder="请选择操作人角色"
                  clearable
                  style="width: 180px"
                  @clear="fetchData"
                  @change="fetchData"
                >
                  <el-option
                    v-for="role in roleList"
                    :key="role.roleCode"
                    :label="role.roleName"
                    :value="role.roleCode"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="searchParams.address"
                  placeholder="请输入请求来源地址查询"
                  clearable
                  style="width: 180px"
                  @clear="fetchData"
                  @keyup.enter="fetchData"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="searchParams.action"
                  placeholder="请输入操作行为查询"
                  clearable
                  style="width: 180px"
                  @clear="fetchData"
                  @keyup.enter="fetchData"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </template>

      <!--数据表格-->
      <el-table
        :data="logList"
        height="calc(83vh - 166px)"
        max-height="70vh"
        border
      >
        <el-table-column prop="logId" label="序号" width="80" align="center" />
        <el-table-column
          prop="usrName"
          label="操作人"
          align="center"
          width="160"
        />
        <el-table-column
          prop="roleName"
          label="角色"
          align="center"
          width="110"
        >
          <template #default="{ row }">
            <el-tag type="success">{{ row.roleName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="请求IP" align="center" width="150">
          <template #default="{ row }">
            <el-tag type="warning" effect="light">{{ row.ip }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="请求来源"
          align="center"
          width="180"
        />
        <el-table-column label="请求方法" align="center">
          <template #default="{ row }">
            <el-tag type="info" effect="plain">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="row.remark"
                placement="top-start"
              >
                <span class="remark">{{ ellipsis(row.remark, 20) }}</span>
              </el-tooltip>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="action"
          label="操作行为"
          align="center"
          width="210"
        >
          <template #default="{ row }">
            <el-tag>{{ row.action }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="操作时间"
          align="center"
          width="180"
          sortable
        >
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
      </el-table>

      <!--分页条-->
      <div class="mt-4">
        <el-pagination
          class="flex float-end"
          background
          layout="total, sizes, prev, pager, next, jumper, ->,"
          :total="total"
          :page-sizes="[9, 20, 30, 50]"
          :page-size="searchParams.pageSize"
          :current-page="searchParams.pageNum"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "SysLog"
});

import { ref, reactive, onMounted } from "vue";
import { Refresh } from "@element-plus/icons-vue";
import { getRoleList } from "@/api/user";
import { getLogList } from "@/api/log";

const searchParams = reactive({
  username: "",
  roleCode: "",
  address: "",
  action: "",
  pageNum: 1,
  pageSize: 9,
  orderBy: "create_time",
  orderType: "desc"
});

const total = ref(0);
const logList = ref<any[]>([]);
const roleList = ref<any[]>([]);

/**
 * 获取系统日志列表数据
 */
const fetchData = async () => {
  const res = await getLogList(searchParams);
  logList.value = res.data.items;
  total.value = res.data.total;
};

/**
 * 获取角色列表数据
 */
const fetchRoleList = async () => {
  const res = await getRoleList();
  roleList.value = res.data;
};

/**
 * 处理分页大小变化事件
 */
const handleSizeChange = (val: number) => {
  searchParams.pageSize = val;
  fetchData();
};

/**
 * 处理页码变化事件
 */
const handlePageChange = (val: number) => {
  searchParams.pageNum = val;
  fetchData();
};

/**
 * 处理刷新按钮点击事件
 */
const handleRefresh = () => {
  searchParams.username = "";
  searchParams.roleCode = "";
  searchParams.address = "";
  searchParams.action = "";
  searchParams.pageNum = 1;
  searchParams.pageSize = 9;
  fetchData();
};

/**
 * 格式化时间
 */
const formatTime = (time: string) => {
  return time.replace("T", " ");
};

/**
 * 超出长度的文本显示省略号
 */
const ellipsis = (text: string, len: number) => {
  if (!text) return "";
  if (text.length > len) {
    return text.slice(0, len) + "...";
  }
  return text;
};

onMounted(() => {
  fetchData();
  fetchRoleList();
});
</script>

<style scoped>
.remark {
  display: inline-block;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
