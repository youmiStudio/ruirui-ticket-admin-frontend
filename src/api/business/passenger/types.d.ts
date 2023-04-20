import { number } from 'echarts';
import type { BaseSearchBody, BaseVo } from '../../types';

export type Passenger = {
  passengerId?: number;
  userId?: number;
  name: string;
  idType: string;
  idNumber: string;
  phone: string;
};

export type PassengerVO = Passenger;

export type PassengerDTO = Passenger;