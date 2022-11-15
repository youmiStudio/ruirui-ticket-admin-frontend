import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { showMessage } from './status';
import { IResponse } from './type';
import { getToken } from '~/utils/auth';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import type { Action } from 'element-plus';
import { tansParams, blobValidate } from '@/utils';
import { saveAs } from 'file-saver';

import { useGlobSettings } from '~/hooks/settings/useGlobSettings';
import { useUserStore } from '~/store';
import { cloneFnJSON } from '@vueuse/core';

const globSetting = useGlobSettings();

// 如果请求花费了超过 `timeout` 的时间，请求将被中断
axios.defaults.timeout = 5000;
// 表示跨域请求时是否需要使用凭证
axios.defaults.withCredentials = false;
// axios.defaults.headers.common['token'] =  AUTH_TOKEN
// 允许跨域
axios.defaults.headers.post['Access-Control-Allow-Origin-Type'] = '*';
const axiosInstance: AxiosInstance = axios.create({
  baseURL: globSetting.apiUrl + ''
});

// axios实例拦截响应
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      const res = response.data;
      if (res.code === 401) {
        ElMessageBox.alert('身份验证已经过期，请重新登录', '提示', {
          type: 'warning',
          confirmButtonText: 'OK',
          callback: (action: Action) => {
            const userStroe = useUserStore();
            userStroe.resetToken();
            location.reload();
          }
        });
        return;
      }
      if (res.code !== 200) {
        if (res instanceof Blob) {
          res.text().then((resText) => {
            try {
              const rspObj = JSON.parse(resText);
              const errMsg = rspObj.msg;
              ElMessage.error(errMsg);
            } catch (error) {}
          });
        } else {
          ElMessage({
            message: res.msg || 'Error',
            type: 'error',
            duration: 5 * 1000
          });
        }
      }
      return response;
    }
    return response;
  },
  // 请求失败
  (error: any) => {
    const { response } = error;
    if (response) {
      if (response.status === 500) {
        ElMessage.error('网络连接异常,请稍后再试!');
      }
      return Promise.reject(response.data);
    }
  }
);

// axios实例拦截请求
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers = {};
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  const conf = config;
  return new Promise((resolve, reject) => {
    axiosInstance
      .request<any, AxiosResponse<IResponse>>(conf)
      .then((res: AxiosResponse<IResponse>) => {
        // resolve(res as unknown as Promise<T>);
        if (res && res.data) {
          resolve(res.data as T);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export function get<T = any>(config: AxiosRequestConfig): Promise<T> {
  return request({ ...config, method: 'GET' });
}

export function post<T = any>(config: AxiosRequestConfig): Promise<T> {
  return request({ ...config, method: 'POST' });
}

export function upload<T = any>(config: AxiosRequestConfig): Promise<T> {
  return request({
    ...config,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function put<T = any>(config: AxiosRequestConfig): Promise<T> {
  return request({ ...config, method: 'put' });
}

export function del<T = any>(config: AxiosRequestConfig): Promise<T> {
  return request({ ...config, method: 'delete' });
}

// 通用下载方法
export function download(
  url: string,
  params: any,
  filename: string,
  config?: any
) {
  const downloadLoadingInstance = ElLoading.service({
    text: '正在下载数据，请稍候',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  return post({
    url,
    data: params,
    transformRequest: [
      (params) => {
        return tansParams(params);
      }
    ],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    ...config
  })
    .then(async (data) => {
      const isBlob = await blobValidate(data);
      if (isBlob) {
        const blob = new Blob([data]);
        saveAs(blob, filename);
      }
      downloadLoadingInstance.close();
    })
    .catch((r) => {
      console.error(r);
      ElMessage.error('下载文件出现错误，请联系管理员！');
      downloadLoadingInstance.close();
    });
}

export default request;
export type { AxiosInstance, AxiosResponse };
