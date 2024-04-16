import GroupLine from "@iconify-icons/ri/group-line";
import Question from "@iconify-icons/ri/question-answer-line";
import CheckLine from "@iconify-icons/ri/chat-check-line";
import Smile from "@iconify-icons/ri/star-smile-line";
import { getTodayDataService, getWeekDataService } from "@/api/dataStatistics";
import { message } from "@/utils/message";

// const todayCheckin = getTodayDataService();

/** 今日入住数、今日退房数、今日订单笔数、今日营业额 */
const chartData = [
  {
    icon: GroupLine,
    bgColor: "#effaff",
    color: "#41b6ff",
    duration: 2200,
    name: "今日入住数",
    value: 36000,
    percent: "+88%",
    data: [2101, 5288, 4239, 4962, 6752, 5208, 7450] // 平滑折线图数据
  },
  {
    icon: Question,
    bgColor: "#fff5f4",
    color: "#e85f33",
    duration: 1600,
    name: "今日退房数",
    value: 16580,
    percent: "+70%",
    data: [2216, 1148, 1255, 788, 4821, 1973, 4379]
  },
  {
    icon: CheckLine,
    bgColor: "#eff8f4",
    color: "#26ce83",
    duration: 1500,
    name: "今日订单笔数",
    value: 16499,
    percent: "+99%",
    data: [861, 1002, 3195, 1715, 3666, 2415, 3645]
  },
  {
    icon: Smile,
    bgColor: "#f6f4fe",
    color: "#7846e5",
    duration: 100,
    name: "今日营业额",
    value: 100,
    percent: "+100%",
    data: [100]
  }
];
// 异步填充今日图表数据
await getTodayDataService().then(({ data }) => {
  // 若获取到空数据，则使用默认数据
  if (null === data) {
    message("今日数据为空，使用预设数据", { type: "warning" });
    return;
  } else {
    chartData.forEach((item, index) => {
      item.name = data[index].name;
      item.value = data[index].value;
      item.percent = data[index].percent;
      item.data = data[index].data;
    });
  }
});

/** 分析概览柱形图数据 */
const barChartData = [
  {
    checkin: [21, 52, 42, 49, 62, 58, 50],
    checkout: [22, 11, 12, 18, 41, 73, 49]
  },
  {
    checkin: [2101, 3280, 4400, 4962, 5752, 6889, 7600],
    checkout: [2116, 3148, 3255, 3788, 4821, 4970, 5390]
  }
];
// 异步填充柱形图数据
await getWeekDataService().then(({ data }) => {
  // 若获取到空数据，则使用默认数据
  if (null === data) {
    message("客流量概览数据为空，使用预设数据", { type: "warning" });
    return;
  } else {
    barChartData.forEach((item, index) => {
      item.checkin = data[index].checkin;
      item.checkout = data[index].checkout;
    });
  }
});

export { chartData, barChartData };
