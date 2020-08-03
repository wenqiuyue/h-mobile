export default {
	path: '/children',
	name: 'children',
	redirect: '/children/home',
	component: () =>
		import(/* webpackChunkName: "children" */ '../../components/container'),
	meta: { children: true },
	children: [
		// 绑定身份
		{
			path: 'binding',
			name: 'children-binding',
			component: () =>
				import(
					/* webpackChunkName: "children" */ '../../views/modules/binding/children'
				)
		},
		// 自主建档
		{
			path: 'archiving',
			name: 'children-archiving',
			component: () =>
				import(
					/* webpackChunkName: "children" */ '../../views/modules/archiving/children'
				)
		},
		// 检查记录
		{
			path: 'inspection-record',
			name: 'children-inspection-record',
			component: () =>
				import(
					/* webpackChunkName: "children" */ '../../views/modules/inspection-record'
				),
			meta: { requireArchiving: true }
		},
		// 检查记录详情
		{
			path: 'inspection-record-details',
			name: 'children-inspection-record-details',
			component: () =>
				import(
					/* webpackChunkName: "children" */ '../../views/modules/inspection-record/details'
				),
			meta: { requireArchiving: true }
		},
		// 档案详情
		{
			path: 'my-archive',
			name: 'children-my-archive',
			component: () =>
				import(
					/* webpackChunkName: "children" */ '../../views/modules/my-archive/children'
				),
			meta: { requireArchiving: true }
		},
		// 档案列表
		{
			path: 'archive/list',
			name: 'children-archive-list',
			component: () =>
				import(
					/* webpackChunkName: "children" */ '../../views/modules/archive-list'
				)
		},
		// 消息通知
		{
			path: 'message',
			name: 'children-message',
			component: () =>
				import(/* webpackChunkName: "children" */ '../../views/message')
		},
		// 消息详情
		{
			path: 'message/details',
			name: 'children-message-details',
			component: () =>
				import(
					/* webpackChunkName: "children" */ '../../views/modules/message-details'
				)
		},
		// 站点列表
		{
			path: 'site/list',
			name: 'children-site-list',
			component: () =>
				import(
					/* webpackChunkName: "children" */ '../../views/modules/site-list'
				)
		}
	]
};
