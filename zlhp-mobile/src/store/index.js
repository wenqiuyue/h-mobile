import _ from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';
import types from '../commons/types';
import { removeToken, setToken } from '../commons/cookies';
import { setLocal, removeLocal } from '../commons/local';
import settings from './settings';
import { setSession } from '../commons/session';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		[types.TOKEN]: null, // 认证 Token
		[types.MODE]: 'mother', // 当前模式
		[types.ORIGIN]: null, // 来源站点
		[types.SUBSCRIBE]: false,
		[types.SETTINGS_PARTICLES]: _.cloneDeep(settings.particles), // 设置-动态背景
		[types.SIGNUP_RADIO]: 0 // 报名列表筛选项
	},
	getters: {
		[types.TOKEN]: state => state[types.TOKEN],
		[types.MODE]: state => state[types.MODE],
		[types.SUBSCRIBE]: state => state[types.SUBSCRIBE],
		[types.ORIGIN]: state => state[types.ORIGIN],
		[types.SETTINGS_PARTICLES]: state => state[types.SETTINGS_PARTICLES],
		[types.SIGNUP_RADIO]: state => state[types.SIGNUP_RADIO]
	},
	actions: {
		[types.TOKEN]({ commit }, payload) {
			return new Promise(resolve => {
				if (payload) {
					setToken(payload);
					commit(types.TOKEN, payload);
				} else {
					removeToken();
					commit(types.TOKEN, null);
				}
				resolve();
			});
		},
		[types.MODE]({ commit }, payload) {
			return new Promise(resolve => {
				if (payload) {
					setLocal(types.MODE, payload);
					commit(types.MODE, payload);
				} else {
					setLocal(types.MODE, 'mother');
					commit(types.MODE, 'mother');
				}
				resolve();
			});
		},
		[types.ORIGIN]({ commit }, payload) {
			return new Promise(resolve => {
				if (payload) {
					setLocal(types.ORIGIN, payload);
					commit(types.ORIGIN, payload);
				} else {
					removeLocal(types.ORIGIN);
					commit(types.ORIGIN, null);
				}
				resolve();
			});
		},
		[types.SUBSCRIBE]({ commit }, payload) {
			return new Promise(resolve => {
				payload = !!payload;
				setSession(types.SUBSCRIBE, payload);
				commit(types.SUBSCRIBE, payload);
				resolve();
			});
		},
		[types.SETTINGS_PARTICLES]({ commit }, payload) {
			return new Promise(resolve => {
				if (payload) {
					if (typeof payload === 'string') {
						payload = JSON.parse(payload);
					}
					setLocal(types.SETTINGS_PARTICLES, JSON.stringify(payload));
					commit(types.SETTINGS_PARTICLES, payload);
				} else {
					setLocal(
						types.SETTINGS_PARTICLES,
						JSON.stringify(settings.particles)
					);
					commit(types.SETTINGS_PARTICLES, settings.particles);
				}
				resolve();
			});
		},
		[types.SIGNUP_RADIO]({ commit }, payload) {
			commit(types.SIGNUP_RADIO, payload);
		}
	},
	mutations: {
		[types.TOKEN](state, payload) {
			state[types.TOKEN] = payload;
		},
		[types.MODE](state, payload) {
			state[types.MODE] = payload;
		},
		[types.ORIGIN](state, payload) {
			state[types.ORIGIN] = payload;
		},
		[types.SUBSCRIBE](state, payload) {
			state[types.SUBSCRIBE] = payload;
		},
		[types.SETTINGS_PARTICLES](state, payload) {
			state[types.SETTINGS_PARTICLES] = payload;
		},
		[types.SIGNUP_RADIO](state, payload) {
			state[types.SIGNUP_RADIO] = payload;
		}
	},
	modules: {}
});
