import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import type {
  Carousel,CarouselDTO,CarouselVO,CarouselPageSearchDTO
} from './types';

enum URL {
  BASE = '/admin/carousel',
  LIST = '/list',
}

const getUrl = (url?: string) => {
  if (!url) {
    url = '';
  }
  return URL.BASE + url;
};

export const list = async (params?: CarouselPageSearchDTO) =>
  get<R<PageVo<CarouselVO[]>>>({ url: getUrl(URL.LIST), params });

export const detail = async (id: number) =>
  get<R<CarouselVO>>({ url: getUrl(`/${id}`) });

export const save = async (data: CarouselDTO) =>
  post<R<string>>({ url: getUrl("/"), data });

export const remove = async (ids: string) =>
  del<R<String>>({ url: getUrl(`/${ids}`)});

export const edit = async (data: CarouselDTO) =>
  put<R<string>>({ url: getUrl(`/`), data });