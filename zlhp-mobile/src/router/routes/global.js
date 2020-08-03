export default [
	// 登录
	{
		path: '/login',
		name: 'login',
		component: () =>
			import(/* webpackChunkName: "global" */ '../../views/modules/login')
	},
	// 模式选择
	{
		path: '/mode',
		name: 'mode',
		component: () =>
			import(/* webpackChunkName: "global" */ '../../views/modules/mode')
	},
	// 消息详情
	{
		path: '/message/details',
		name: 'message-details',
		component: () =>
			import(
				/* webpackChunkName: "global" */ '../../views/modules/message-details'
			)
	},
	// 栏目详情
	{
		path: '/section/details',
		name: 'section-details',
		component: () =>
			import(
				/* webpackChunkName: "global" */ '../../views/modules/section-details'
			)
	},
	// 档案列表
	{
		path: '/archive/list',
		name: 'archive-list',
		component: () =>
			import(
				/* webpackChunkName: "global" */ '../../views/modules/archive-list'
			)
	},
	// 站点列表
	{
		path: '/site/list',
		name: 'site-list',
		component: () =>
			import(/* webpackChunkName: "global" */ '../../views/modules/site-list')
	},
	// 设置
	{
		path: '/settings',
		name: 'settings',
		component: () =>
			import(/* webpackChunkName: "global" */ '../../views/modules/settings')
	},
	// 关于
	{
		path: '/about',
		name: 'about',
		component: () =>
			import(/* webpackChunkName: "global" */ '../../views/modules/about')
	},
	// 测试
	{
		path: '/test',
		name: 'test',
		component: () => import(/* webpackChunkName: "global" */ '../../views/test')
	},
	// 支付测试
	{
		path: '/test-pay',
		name: 'test-pay',
		component: () =>
			import(/* webpackChunkName: "global" */ '../../views/test/pay')
	},
	// 聊天测试
	{
		path: '/test-chat',
		name: 'test-chat',
		meta: { requireAuth: true },
		component: () =>
			import(/* webpackChunkName: "global" */ '../../views/test/chat')
	},
	// 上传测试
	{
		path: '/test-upload',
		name: 'test-upload',
		meta: { requireAuth: true },
		component: () =>
			import(/* webpackChunkName: "global" */ '../../views/test/upload')
	},
	// 首页测试
	{
		path: '/home-test',
		name: 'home-test',
		meta: { requireAuth: true },
		component: () =>
			import(/* webpackChunkName: "global" */ '../../views/test/home-test')
	},
	// 授权测试
	{
		path: '/auth-test',
		name: 'auth-test',
		meta: { requireAuth: true },
		component: () =>
			import(/* webpackChunkName: "global" */ '../../views/test/auth')
	},
	// Promise测试
	{
		path: '/promise-test',
		name: 'promise-test',
		meta: { requireAuth: true },
		component: () =>
			import(/* webpackChunkName: "global" */ '../../views/test/promise')
	},
	// 聊天列表
	{
		path: '/chat-list-test',
		name: 'chat-list-test',
		meta: { requireAuth: true },
		component: () =>
			import(/* webpackChunkName: "global" */ '../../views/test/chat-list')
	}
];
