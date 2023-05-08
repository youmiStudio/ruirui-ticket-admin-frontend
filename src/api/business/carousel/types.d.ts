import type { BaseSearchBody, BaseVo } from '../../types';

export type Carousel = {
  carouselId?: number;
  routeId?: number;
  original: string;
  sort: number;
  status: string;
};

export type CarouselVO = Carousel & {
  routeName: string;
};

export type CarouselDTO = Carousel;

export type CarouselPageSearchDTO = {
  status?: string;
} & BaseSearchBody;
