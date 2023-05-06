export type RealTime = {
  ip: number;
  uv: number;
  orderCount: number;
  payOrderCount: number;
  payBuyerCount: number;
  refundOrderCount: number;
  payAmount: number;
  refundAmount: number;
  payRate: number;
  refundRate: number;
};

export type AnalysisSearchDTO = {
  beginDate:string;
  endDate:string
}

export type FlowsVO = {
  ip: number;
  uv: number;
}

export type RealTimeVO = {
  today: RealTime;
  yesterday: RealTime;
};
