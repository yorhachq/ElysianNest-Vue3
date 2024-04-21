<template>
  <div class="room-type-container">
    <el-card class="flex flex-col max-h-full">
      <!--页面标题-->
      <template #header>
        <div class="card-header mt-1">
          <span class="font-bold text-lg">房间类型管理</span>
          <div class="float-end">
            <el-input
              v-model="searchKeyword"
              placeholder="请输入关键词回车搜索"
              clearable
              style="width: 200px; margin-right: 10px"
              @clear="fetchData"
              @keyup.enter="fetchData"
            />
            <el-button type="primary" @click="handleAdd"
              >添加房间类型
            </el-button>
            <el-button
              type="text"
              :icon="Refresh"
              circle
              style="margin-left: 10px"
              @click="handleRefresh"
            />
          </div>
        </div>
      </template>

      <!--数据表格-->
      <el-table
        :data="roomTypeList"
        height="calc(78vh - 200px)"
        max-height="70vh"
      >
        <el-table-column
          prop="roomTypeId"
          label="序号"
          align="center"
          sortable
        />
        <el-table-column prop="typeName" label="房型名称" align="center" />
        <el-table-column prop="price" label="房型价格" align="center" sortable>
          <template #default="scope"> {{ scope.row.price }}&nbsp;¥</template>
        </el-table-column>
        <el-table-column prop="image" label="房型图片" align="center">
          <template #default="scope">
            <img :src="scope.row.image" class="w-20 h-20 object-cover" />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="房型描述" align="center" />
        <el-table-column
          prop="updateTime"
          label="更新时间"
          align="center"
          sortable
        >
          <template #default="scope">
            {{ scope.row.updateTime.replace("T", "&nbsp;") }}
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
              @click="handleDelete(scope.row.roomTypeId)"
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
          :page-sizes="[3, 10, 20, 50]"
          :page-size="pageSize"
          :current-page="pageNum"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!--添加/编辑房型对话框-->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item
          label="房型名称"
          prop="typeName"
          :rules="[
            { required: true, message: '房型名称不能为空', trigger: 'blur' }
          ]"
        >
          <el-input v-model="form.typeName" placeholder="请输入房型名称" />
        </el-form-item>
        <el-form-item label="房型价格" prop="price">
          <el-input-number v-model="form.price" :min="0" />
        </el-form-item>
        <el-form-item label="房型图片" prop="image">
          <el-upload
            class="image-uploader"
            action="/api/upload"
            :auto-upload="true"
            :headers="{ Authorization: getToken().accessToken }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="form.image" :src="form.image" class="avatar" />
            <el-icon v-else class="image-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="房型描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="介绍下这个房型吧"
          />
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
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Refresh } from "@element-plus/icons-vue";
import {
  addRoomType,
  updateRoomType,
  deleteRoomType,
  getRoomTypeList
} from "@/api/roomType";
import { RoomType } from "@/api/roomType";
import { getToken } from "@/utils/auth";

const roomTypeList = ref<RoomType[]>([]);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(3);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const formRef = ref();
const form = reactive<RoomType>({
  roomTypeId: 0,
  typeName: "",
  price: 0,
  image: "",
  description: "",
  status: "正常",
  createTime: "",
  updateTime: ""
});
const searchKeyword = ref("");

defineOptions({
  name: "RoomType"
});

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  const res = await getRoomTypeList({
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    keyword: searchKeyword.value
  });
  roomTypeList.value = res.data.items;
  total.value = res.data.total;
};
const handleRefresh = () => {
  searchKeyword.value = "";
  pageNum.value = 1;
  pageSize.value = 3;
  fetchData();
};
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchData();
};

const handlePageChange = (val: number) => {
  pageNum.value = val;
  fetchData();
};

const handleAdd = () => {
  dialogTitle.value = "添加房间类型";
  form.roomTypeId = 0;
  form.typeName = "";
  form.price = 0;
  form.image = "";
  form.description = "";
  dialogVisible.value = true;
};

const handleEdit = (row: RoomType) => {
  dialogTitle.value = "编辑房间类型";
  Object.assign(form, row);
  dialogVisible.value = true;
};

const handleDelete = (id: number) => {
  ElMessageBox.confirm("确定删除该房间类型吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await deleteRoomType(id);
    ElMessage.success("删除成功");
    await fetchData();
  });
};

const handleAvatarSuccess = (response: any) => {
  form.image = response.data;
};

const beforeUpload = (rawFile: any) => {
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    ElMessage.error("图片必须是 JPG/PNG 格式!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error("图片大小不能超过 5MB!");
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  if (!formRef.value.validate()) return;
  formRef.value.validate(async valid => {
    if (valid) {
      if (form.roomTypeId === 0) {
        await addRoomType(form);
        ElMessage.success("添加成功");
      } else {
        await updateRoomType(form);
        ElMessage.success("更新成功");
      }
      dialogVisible.value = false;
      await fetchData();
    }
  });
};
</script>

<style scoped>
.room-type-container {
  @apply p-4;
}

.image-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.image-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.image-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
