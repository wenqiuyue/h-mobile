export default [
	// 404错误
	{
		path: '/404',
		name: '404',
		component: () =>
			import(/* webpackChunkName: "error" */ '../../views/error/404.vue')
	},
	// 页面未找到跳转404
	{
		path: '*',
		redirect: '/404',
		component: () =>
			import(/* webpackChunkName: "error" */ '../../views/error/404.vue')
	}
];
