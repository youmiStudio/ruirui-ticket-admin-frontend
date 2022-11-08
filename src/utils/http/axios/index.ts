import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { showMessage } from './status';
import { IResponse } from './type';
import { getToken } from '~/utils/auth';
import { ElMessage,ElMessageBox } from 'element-plus';
import type { Action } from 'element-plus'

// If you want to use ElMessage, import it.
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'

import { useGlobSettings } from '~/hooks/settings/useGlobSettings';
import { useUserStore } from '~/store';

const globSetting = useGlobSettings();

// 如果请求话费了超过 `timeout` 的时间，请求将被中断
axios.defaults.timeout = 5000;
// 表示跨域请求时是否需要使用凭证
axios.defaults.withCredentials = false;
// axios.defaults.headers.common['token'] =  AUTH_TOKEN
// 允许跨域
axios.defaults.headers.post['Access-Control-Allow-Origin-Type'] = '*';
const axiosInstance: AxiosInstance = axios.create({
  baseURL: globSetting.apiUrl + '',
  timeout: 5000
});

// axios实例拦截响应
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      const res = response.data
      if (res.code === 401) {
        ElMessageBox.alert('身份验证已经过期，请重新登录', '提示', {
          type:"warning",
          confirmButtonText: 'OK',
          callback: (action: Action) => {
            const userStroe = useUserStore();
            userStroe.resetToken();
            location.reload();
          },
        })
        return;
      }
      if (res.code !== 200) {
        ElMessage({
          message: res.msg || "Error",
          type: 'error',
          duration: 5 * 1000
        });
      }
      return response;
    }
    return response;
  },
  // 请求失败
  (error: any) => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      showMessage(response.status);
      return Promise.reject(response.data);
    }
    showMessage('网络连接异常,请稍后再试!');
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
        const { data } = res;
        resolve(data as T);
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

export default request;
export type { AxiosInstance, AxiosResponse };
