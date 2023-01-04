import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import type { ServerInfoVo } from './types';

export const getServerInfo = async () =>
  get<R<ServerInfoVo>>({ url: "/monitor/server" });