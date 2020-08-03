import axios from "axios";
import store from "../store";
import router from '../router';
const instance = axios.create({
  withCredentials: true
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  config => {
    const innerConfig = config;
    if (store.state.token) {
      innerConfig.headers.Authorization = store.state.token;
    }
    // 在发送请求之前做些什么
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
  response => {
    // 在返回结果之前做些什么
    return response;
  },
  error => {
    if(error.message.indexOf('401')!==-1)
      router.push('/login')
    return Promise.reject(error);
  }
);

/**
 * GET
 * @param url
 * @param params
 * @param config
 * @returns {Promise<unknown>}
 */
export function fetchGet(url, params, config) {
  return new Promise((resolve, reject) => {
    instance
      .get(url, {
        params,
        ...config
      })
      .then(
        response => resolve(response.data),
        error => reject(error)
      )
      .catch(reject);
  });
}

/**
 * POST
 * @param url
 * @param params
 * @param config
 * @returns {Promise<unknown>}
 */
export function fetchPost(url, params, config) {
  return new Promise((resolve, reject) => {
    instance
      .post(url, params, config)
      .then(
        response => resolve(response.data),
        error => reject(error)
      )
      .catch(reject);
  });
}

/**
 * PUT
 * @param url
 * @param params
 * @param config
 * @returns {Promise<unknown>}
 */
export function fetchPut(url, params, config) {
  return new Promise((resolve, reject) => {
    instance
      .put(url, params, config)
      .then(
        response => resolve(response.data),
        error => reject(error)
      )
      .catch(reject);
  });
}

/**
 * DELETE
 * @param url
 * @param params
 * @param config
 * @returns {Promise<unknown>}
 */
export function fetchDelete(url, params, config) {
  return new Promise((resolve, reject) => {
    instance
      .delete(url, {
        params,
        ...config
      })
      .then(
        response => resolve(response.data),
        error => reject(error)
      )
      .catch(reject);
  });
}
