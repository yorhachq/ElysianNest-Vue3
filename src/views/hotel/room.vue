<template>
  <div class="room-container">
    <el-card class="flex flex-col max-h-full">
      <!--页面标题-->
      <template #header>
        <div class="card-header mt-1">
          <span class="font-bold text-lg">房间管理</span>
          <div class="float-end">
            <!--搜索框-->
            <el-input
              v-model="searchParams.roomNumber"
              placeholder="请输入房间号回车查询"
              type="number"
              min="1"
              clearable
              style="width: 200px; margin-right: 10px"
              @clear="fetchData"
              @keyup.enter="fetchData"
            />
            <!--添加房间按钮-->
            <el-button type="primary" @click="handleAdd">添加房间</el-button>
            <!--刷新按钮-->
            <el-button
              type="info"
              :icon="Refresh"
              circle
              style="margin-left: 10px"
              @click="handleRefresh"
            />
          </div>
          <div class="float-end -mb-4">
            <!--筛选表单-->
            <el-form :inline="true" :model="searchParams">
              <el-form-item label="楼层">
                <el-select
                  v-model="searchParams.floorNumber"
                  placeholder="请选择楼层"
                  style="width: 120px"
                  @change="fetchData"
                >
                  <el-option label="全部" value="" />
                  <el-option
                    v-for="floor in floorList"
                    :key="floor"
                    :label="floor"
                    :value="floor"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="房间类型">
                <el-select
                  v-model="searchParams.roomTypeId"
                  placeholder="请选择房间类型"
                  style="width: 200px"
                  @change="fetchData"
                >
                  <el-option label="全部" value="" />
                  <el-option
                    v-for="type in roomTypeList"
                    :key="type.roomTypeId"
                    :label="type.typeName"
                    :value="type.roomTypeId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="房间状态">
                <el-select
                  v-model="searchParams.status"
                  placeholder="请选择房间状态"
                  style="width: 120px"
                  @change="fetchData"
                >
                  <el-option label="全部" value="" />
                  <el-option label="空闲" value="空闲" />
                  <el-option label="已预订" value="已预订" />
                  <el-option label="已入住" value="已入住" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </template>

      <!--数据表格-->
      <el-table :data="roomList" height="calc(78vh - 200px)" max-height="70vh">
        <el-table-column prop="roomId" label="序号" align="center" sortable />
        <el-table-column
          prop="roomNumber"
          label="房间号"
          align="center"
          sortable
        />
        <el-table-column
          prop="floorNumber"
          label="楼层"
          align="center"
          sortable
        />
        <el-table-column prop="roomTypeName" label="房间类型" align="center" />
        <el-table-column prop="status" label="房间状态" align="center">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)"
              >{{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          align="center"
          sortable
        >
          <template #default="scope">
            {{ formatTime(scope.row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200rem">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              >编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row.roomId)"
              >删除
            </el-button>
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
          :page-sizes="[7, 10, 30, 50]"
          :page-size="searchParams.pageSize"
          :current-page="searchParams.pageNum"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!--添加/编辑房间对话框-->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="345px">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item
          label="楼层"
          prop="floorNumber"
          :rules="[
            { required: true, message: '楼层不能为空', trigger: 'blur' },
            {
              type: 'number',
              min: 1,
              message: '楼层必须为正整数',
              trigger: 'blur'
            }
          ]"
        >
          <el-input-number
            v-model.number="form.floorNumber"
            :min="1"
            :max="99"
            oninput="value=value.slice(0,2)"
          />
        </el-form-item>
        <el-form-item
          label="房间号"
          prop="roomNumber"
          :rules="[
            { required: true, message: '房间号不能为空', trigger: 'blur' }
          ]"
        >
          <div class="flex items-center">
            <span class="text-gray-400 mr-2 text-lg max-w-full">{{
              form.floorNumber
            }}</span>
            <el-input v-model.number="roomNumberWithoutFloor" type="number" />
          </div>
        </el-form-item>
        <el-form-item
          label="房间类型"
          prop="roomTypeId"
          :rules="[
            { required: true, message: '房间类型不能为空', trigger: 'blur' }
          ]"
        >
          <el-select v-model="form.roomTypeId" placeholder="请选择房间类型">
            <el-option
              v-for="type in roomTypeList"
              :key="type.roomTypeId"
              :label="type.typeName"
              :value="type.roomTypeId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Room, addRoom, updateRoom, deleteRoom, getRoomList } from "@/api/room";
import { RoomType, getRoomTypeList } from "@/api/roomType";
import { Refresh } from "@element-plus/icons-vue";

const roomList = ref<Room[]>([]);
const roomTypeList = ref<RoomType[]>([]);
const floorList = ref<number[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const formRef = ref();
const form = reactive<Room>({
  roomId: 0,
  roomNumber: 0,
  floorNumber: 0,
  roomTypeId: 0,
  roomTypeName: "",
  status: "",
  createTime: "",
  updateTime: ""
});
const searchParams = reactive({
  roomNumber: "",
  floorNumber: "",
  roomTypeId: "",
  status: "",
  pageNum: 1,
  pageSize: 7
});
const roomNumberWithoutFloor = computed({
  get: () => {
    const fullRoomNumber = form.roomNumber.toString();
    return parseInt(fullRoomNumber.slice(form.floorNumber.toString().length));
  },
  set: value => {
    form.roomNumber = parseInt(
      form.floorNumber.toString() + value.toString().padStart(2, "0")
    );
  }
});

defineOptions({
  name: "Room"
});

onMounted(() => {
  fetchData();
  fetchRoomTypeList();
});

/**
 * 获取房间列表数据
 */
const fetchData = async () => {
  const res = await getRoomList(searchParams);
  roomList.value = res.data.items;
  total.value = res.data.total;
  floorList.value = [...new Set(res.data.items.map(item => item.floorNumber))];
};

/**
 * 获取房间类型列表数据
 */
const fetchRoomTypeList = async () => {
  const res = await getRoomTypeList({ pageNum: 1, pageSize: 100 });
  roomTypeList.value = res.data.items;
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
 * 处理添加房间按钮点击事件
 */
const handleAdd = () => {
  dialogTitle.value = "添加房间";
  form.roomNumber = 1;
  form.floorNumber = 1;
  form.roomTypeId = 1;
  dialogVisible.value = true;
};

/**
 * 处理编辑房间按钮点击事件
 */
const handleEdit = (row: Room) => {
  dialogTitle.value = "编辑房间";
  Object.assign(form, row);
  dialogVisible.value = true;
};

/**
 * 处理删除房间按钮点击事件
 */
const handleDelete = (id: number) => {
  ElMessageBox.confirm("确定删除该房间吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await deleteRoom(id);
    ElMessage.success("删除成功");
    await fetchData();
  });
};

/**
 * 处理表单提交事件
 */
const handleSubmit = async () => {
  if (!formRef.value.validate()) return;
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      form.roomNumber = parseInt(
        form.floorNumber.toString() +
          form.roomNumber.toString().slice(form.floorNumber.toString().length)
      );
      if (form.roomId === 0) {
        await addRoom(form);
        ElMessage.success("添加成功");
      } else {
        await updateRoom(form);
        ElMessage.success("更新成功");
      }
      dialogVisible.value = false;
      await fetchData();
    }
  });
};

/**
 * 处理刷新按钮点击事件
 */
const handleRefresh = () => {
  searchParams.roomNumber = "";
  searchParams.floorNumber = "";
  searchParams.roomTypeId = "";
  searchParams.status = "";
  searchParams.pageNum = 1;
  searchParams.pageSize = 7;
  fetchData();
};

/**
 * 格式化时间
 */
const formatTime = (time: string) => {
  return time.replace("T", " ");
};

/**
 * 获取房间状态对应的标签类型
 */
const getStatusType = (status: string) => {
  switch (status) {
    case "空闲":
      return "success";
    case "已预订":
      return "warning";
    case "已入住":
      return "danger";
    case "冻结":
      return "info";
    default:
      return "";
  }
};
</script>

<style scoped>
.room-container {
  @apply p-4;
}
</style>
