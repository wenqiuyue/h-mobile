// import 'babel-polyfill';
import Vue from 'vue';
import VueParticles from 'vue-particles'; // 粒子特效
import Vant, { Toast } from 'vant';
import App from './App.vue';
import router from './router';
import store from './store';

import 'vant/lib/index.less';
import './assets/iconfont/iconfont';
import './tools/rem';
import './tools/extend';

import { rewrite } from './tools';
import { getToken } from './commons/cookies';
import { getLocal } from './commons/local';
import { getSession } from './commons/session';

import types from './commons/types';
import validate from './commons/validate'; // 表单验证模块
import components from './components'; // 自定义模板

Vue.use(Vant);

Vue.use(VueParticles);
Vue.use(validate);
Vue.use(components);

// Vant Toast 配置
Toast.setDefaultOptions('loading', { forbidClick: true, duration: 0 });
Toast.success = rewrite({ fn: Toast.success, delay: 10 });
Toast.fail = rewrite({ fn: Toast.fail, delay: 10 });

// 缓存数据加载
store.dispatch(types.TOKEN, getToken()).then();
store.dispatch(types.MODE, getLocal(types.MODE)).then();
store.dispatch(types.ORIGIN, getLocal(types.ORIGIN)).then();
store.dispatch(types.SUBSCRIBE, getSession(types.SUBSCRIBE)).then();
store
	.dispatch(types.SETTINGS_PARTICLES, getLocal(types.SETTINGS_PARTICLES))
	.then();

// 生产环境配置
if (process.env.NODE_ENV === 'development') {
	Vue.config.productionTip = false; // 生产消息
	Vue.config.devtools = true; // 允许devTools
	// eslint-disable-next-line no-console
	console.info('当前环境变量', process.env);
}

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
