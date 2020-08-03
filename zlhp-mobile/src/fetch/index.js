import axios from 'axios';
import store from '../store';
import types from '../commons/types';

const instance = axios.create({
	// baseURL: process.env.BASE_API, // api的base_url
	// timeout: 10000, // 请求超时时间
	withCredentials: true
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
	config => {
		const innerConfig = config;
		if (store.state[types.TOKEN]) {
			innerConfig.headers.Authorization = store.state[types.TOKEN];
		}
		// 在发送请求之前做些什么
		return innerConfig;
	},
	// 对请求错误做些什么
	error => Promise.reject(error)
);

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
	// 对响应数据做点什么
	response => response,
	error => {
		// 未登录
		if (error.response.status === 401) {
			store.dispatch(types.TOKEN).then();
			document.location.href = '/login';
		}
		// 对响应错误做点什么
		return Promise.reject(error);
	}
);

/**
 * GET
 * @param url
 * @param config
 * @returns {Promise<unknown>}
 */
export function fetchGet(url, config) {
	return new Promise((resolve, reject) => {
		instance
			.get(url, config)
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
 * @param config
 * @returns {Promise<unknown>}
 */
export function fetchDelete(url, config) {
	return new Promise((resolve, reject) => {
		instance
			.delete(url, config)
			.then(
				response => resolve(response.data),
				error => reject(error)
			)
			.catch(reject);
	});
}
