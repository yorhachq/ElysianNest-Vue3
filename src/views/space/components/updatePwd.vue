<template>
  <div style="text-align: left">
    <el-dialog v-model="dialogVisible" title="修改密码" width="30%">
      <el-form
        ref="pwdForm"
        :model="userPwd"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPwd">
          <el-input v-model="userPwd.oldPwd" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="userPwd.newPwd" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="rePwd">
          <el-input v-model="userPwd.rePwd" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { updatePwdService } from "@/api/user";
import { message } from "@/utils/message";

const dialogVisible = ref(false);
const pwdForm = ref<FormInstance>();

const userPwd = reactive({
  oldPwd: "",
  newPwd: "",
  rePwd: ""
});

const rules = reactive<FormRules>({
  oldPwd: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  newPwd: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { pattern: /^\S{5,16}$/, message: "密码长度应为5~16位", trigger: "blur" }
  ],
  rePwd: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== userPwd.newPwd) {
          callback(new Error("确认密码与新密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

const submitForm = async () => {
  if (!pwdForm.value) return;

  await pwdForm.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        const res = await updatePwdService(userPwd);
        if (res.success === true) {
          message("密码修改成功!", { type: "success" });
          dialogVisible.value = false;
          resetForm();
        } else {
          message(res.message, { type: "error" });
        }
      } catch (err) {}
    }
  });
};

const resetForm = () => {
  userPwd.oldPwd = "";
  userPwd.newPwd = "";
  userPwd.rePwd = "";
  pwdForm.value?.resetFields();
};

defineExpose({
  open: () => (dialogVisible.value = true)
});
</script>
<style scoped></style>
