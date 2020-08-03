import global from './global';
import mother from './mother';
import children from './children';
import error from './error';

export default [
	{
		path: '/',
		name: 'main',
		redirect: '/home',
		component: () =>
			import(/* webpackChunkName: "root" */ '../../views/main.vue'),
		children: [
			{
				path: 'home',
				name: 'home',
				component: () =>
					import(/* webpackChunkName: "root" */ '../../views/home'),
				meta: { requireAuth: true }
			},
			{
				path: 'message',
				name: 'message',
				component: () =>
					import(/* webpackChunkName: "root" */ '../../views/message'),
				meta: { requireAuth: true }
			},
			{
				path: 'my',
				name: 'my',
				component: () =>
					import(/* webpackChunkName: "root" */ '../../views/my'),
				meta: { requireAuth: true }
			}
		]
	},
	{
		path: '/children',
		name: 'children-main',
		redirect: '/children/home',
		component: () =>
			import(/* webpackChunkName: "root" */ '../../views/main.vue'),
		children: [
			{
				path: 'home',
				name: 'home',
				component: () =>
					import(/* webpackChunkName: "root" */ '../../views/home'),
				meta: { requireAuth: true, children: true }
			},
			{
				path: 'message',
				name: 'message',
				component: () =>
					import(/* webpackChunkName: "root" */ '../../views/message'),
				meta: { requireAuth: true, children: true }
			},
			{
				path: 'my',
				name: 'my',
				component: () =>
					import(/* webpackChunkName: "root" */ '../../views/my'),
				meta: { requireAuth: true, children: true }
			}
		]
	},
	mother,
	children,
	...global,
	...error
];
