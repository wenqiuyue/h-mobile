import Vue from 'vue';
import VueRouter from 'vue-router';
import { Dialog, Toast } from 'vant';
import wx from 'weixin-js-sdk';
import routes from './routes';
import store from '../store';
import types from '../commons/types';
import { setSession } from '../commons/session';
import { setDocumentTitle } from '../commons';
import * as ArchiveApi from '../apis/ArchiveApi';
import { ChangeSite } from '../apis/UserApi';
import * as ChildrenArchivesApi from '../apis/ChildrenArchivesApi';
import { rewrite, has } from '../tools';

Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

/**
 * 全局前置守卫
 */
router.beforeEach((to, from, next) => {
	const { meta } = to;
	if (
		has.call(meta, 'children') ||
		!!meta.children ||
		(to.matched.length && to.matched[0].meta.children)
	) {
		store.dispatch(types.MODE, 'children');
	} else {
		store.dispatch(types.MODE, 'mother');
	}

	// 如果没有匹配到路由则跳转404界面
	if (!to.matched.length) {
		next('/404');
	}

	// 记录当前路由
	if (to.name !== 'login') {
		const isFrom = to.fullPath === '/' && to.path === '/' && to.name === null;
		const prevRoute = {
			fullPath: isFrom ? from.fullPath : to.fullPath,
			path: isFrom ? from.path : to.path,
			name: isFrom ? from.name : to.name,
			meta: isFrom ? from.meta : to.meta,
			query: isFrom ? from.query : to.query
		};
		setSession(types.PREV_ROUTE, JSON.stringify(prevRoute));
	}

	// 判断是否需要登录权限
	if (to.matched.some(m => m.meta.requireAuth) && !store.state[types.TOKEN]) {
		next({ path: '/login' });
	} else if (to.meta.requireArchiving) {
		// 判断是否需要建档权限
		const dispose = response => {
			if (response.Code !== 0 && !response.Body) {
				Dialog.confirm({
					title: '系统提示',
					message: response.Message
				})
					.then(() => {
						next({ path: `/${store.state[types.MODE]}/binding` });
					})
					.catch(() => {
						if (store.state[types.MODE] === 'mother') {
							next({ path: `/home` });
						} else {
							next({ path: `/${store.state[types.MODE]}/home` });
						}
					});
			} else {
				next();
			}
		};
		Toast.loading('权限验证中...');
		if (store.state[types.MODE] === 'mother') {
			ArchiveApi.IsArchiving()
				.then(dispose)
				.finally(Toast.clear);
		} else {
			ChildrenArchivesApi.IsArchiving()
				.then(dispose)
				.finally(Toast.clear);
		}
	} else if (to.meta.requireBindHis) {
		// 判断是否需要绑定权限
		// eslint-disable-next-line no-console
		console.error('TODO: 绑定认证');
		next();
	} else {
		next();
	}
	// url切换站点
	if (to.name !== 'login' && to.query.fromSite) {
		ChangeSite(to.query.fromSite).then(response => {
			if (response.Code === 0) {
				setDocumentTitle(response.Body.HospitalName);
			} else {
				this.$toast.fail(response.Message);
			}
		});
		setSession(types.FROMSITE, JSON.stringify(to.query.fromSite));
	}
});

router.oldBack = router.back;

/**
 * 重写路由返回方法
 */
router.back = rewrite({
	fn: router.back,
	before: () => {
		if (window.history.length <= 1) {
			wx.closeWindow();
		}
	}
});

export default router;
