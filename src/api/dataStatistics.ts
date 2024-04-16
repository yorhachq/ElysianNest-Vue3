import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

// 页面最上方小方格数据
type ChartResult = {
  success: boolean;
  msg: string;
  data: ChartData;
};
type ChartData = [
  {
    name: string;
    value: number;
    percent: string;
    data: Array<number>;
  }
];
// 全周概览柱状图数据
type BarChartResult = {
  success: boolean;
  msg: string;
  data: BarChartData;
};
type BarChartData = {
  checkinData: Array<number>;
  checkoutData: Array<number>;
};

export const getTodayDataService = () => {
  return http.request<ChartResult>(
    "get",
    baseUrlApi("/dataStatistics/todayData")
  );
};

export const getWeekDataService = () => {
  return http.request<BarChartResult>(
    "get",
    baseUrlApi("/dataStatistics/weekData")
  );
};
