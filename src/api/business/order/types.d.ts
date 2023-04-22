export type Order = {
  orderId: number;
  userId: number;
  orderNo: string;
  totalAmount: number;
  payAmount: number;
  refundAmount: number;
  travelDate: Date;
  orderTime: Date;
  payExpireTime: Date;
  paymentTime: Date;
  deliveryTime: Date;
  finallyTime: Date;
  cancelTime: Date;
  refundTime: Date;
  status: string;
  buyer: OrderBuyerVO;
  route: OrderRouteVO;
  routeSku: OrderRouteSkuVO;
  car: OrderCarVO;
};

export type OrderVO = Order

export type OrderBuyerVO = {
  // properties of OrderBuyerVO
  userId: number;
  nickname: string;
  avatar: string;
};

export type OrderRouteVO = {
  // properties of OrderRouteVO
  routeId: number;
  name: string;
  describe: string;
  mainImgUrl: string;
};

export type OrderRouteSkuVO = {
  // properties of OrderRouteSkuVO
  routeSkuId: number;
  name: string;
};

export type OrderCarVO = {
  // properties of OrderCarVO
  carId: number;
  name: string;
  describe: string;
  no: string;
  mainImgUrl: string;
};


export type OrderPageSearchDTO = {
  userId?: number;
  orderNo?: string;
  nickName?: string;
  routeName?: string;
  carName?: string;
  carNo?: string;
  orderStatus?: string;
  minPriceAmount?: number;
  maxPriceAmount?: number;
  beginTravelDate?: string;
  endTravelDate?: string;
  beginOrderTime?: string;
  endOrderTime?: string;
};