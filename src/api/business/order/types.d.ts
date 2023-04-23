import { SeatPosition, SeatSize } from '~/views/business/seat-scheme/types';

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

export type OrderItem = {
  orderItemId: number;
  orderNo: string;
  passengerId: number;
  seatSchemePositionId: number;
  seatId: number;
  seatName: string;
  seatPosition: SeatPosition;
  seatSize: SeatSize;
  seatDescribe: string;
  seatPrice: number;
  passengerName: string;
  passengerIdType: string;
  passengerIdNumber: string;
  passengerPhone: string;
  passengerGender: string;
  status: string;
};

export type OrderItemListVO = {
  orderItemId: number;
  orderNo: string;
  passengerId: number;
  seatSchemePositionId: number;
  seatId: number;
  seatName: string;
  seatPosition: SeatPosition;
  seatSize: SeatSize;
  seatDescribe: string;
  seatPrice: number;
  passengerName: string;
  passengerIdType: string;
  passengerIdNumber: string;
  passengerPhone: string;
  passengerGender: string;
  status: string;
  buyer: OrderBuyerVO;
  route: OrderRouteVO;
  routeSku: OrderRouteSkuVO;
  car: OrderCarVO;
};

export type OrderItemVo = OrderItem;

export type OrderVO = Order;

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

export type OrderItemPageSearchDTO = {
  orderNo?: string;
  passengerName?: string;
  passengerPhone?: string;
  passengerIdNumber?: string;
  routeName?: string;
  carName?: string;
  carNo?: string;
  minPayAmount?: string;
  maxPayAmount?: string;
  beginTravelDate?: string; // Assuming that the date will be represented as a string in ISO 8601 format (YYYY-MM-DD)
  endTravelDate?: string; // Assuming that the date will be represented as a string in ISO 8601 format (YYYY-MM-DD)
  beginOrderTime?: string; // Assuming that the date will be represented as a string in ISO 8601 format (YYYY-MM-DDTHH:mm:ss)
  endOrderTime?: string; // Assumin
};
