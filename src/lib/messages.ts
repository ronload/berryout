export const messages = {
  brand: "BERRYOUT",
  notFound: {
    code: "404",
    title: "找不到頁面",
    backHome: "返回首頁",
  },
  dateRange: {
    enlistment: "入伍日期",
    discharge: "退伍日期",
  },
  progress: {
    percentage: (value: number) => `${value.toFixed(2)}%`,
    enlisted: "已入伍",
    days: "天",
    hours: "小時",
  },
  countdown: {
    daysUntilDischarge: "天後退伍",
    hours: "時",
    minutes: "分",
    seconds: "秒",
  },
  counter: {
    accompanied: "已陪伴",
    discharged: "人退伍",
  },
  share: {
    idle: "分享倒數",
    copied: "已複製",
  },
} as const;
