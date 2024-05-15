import * as XLSX from "xlsx";
import { message } from "@/utils/message";

interface ExportOptions {
  data: any[];
  fileName: string;
  sheetName?: string;
  dateFormat?: string;
}

export const exportExcel = (options: ExportOptions) => {
  const {
    data,
    fileName,
    sheetName = "Sheet1",
    dateFormat = "yyyy-mm-dd hh:mm:ss"
  } = options;

  // 检查数据是否为空
  if (!data || data.length === 0) {
    message("数据为空，无法导出Excel文件", { type: "error" });
    return;
  }

  // 创建工作簿对象
  const workbook = XLSX.utils.book_new();

  // 将数据转换为工作表数据
  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: Object.keys(data[0]),
    dateNF: dateFormat // 设置日期格式
  });

  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // 处理时间后缀
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始，所以需要+1
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0"); // 添加秒数
  const formattedTime = `${year}${month}${day}${hours}${minutes}${seconds}`; // 时间格式

  // 生成Excel文件
  XLSX.writeFile(workbook, `${fileName}_${formattedTime}.xlsx`);
};
