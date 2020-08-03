import global from './global';

export default [
	{
		title: '儿童档案',
		icon: 'icon-babyMy_Archives',
		value: '',
		label: '',
		to: '/children/archive/list?editor'
	},
	{
		title: '消息通知',
		icon: 'icon-my_news1',
		value: '',
		label: '',
		to: '/children/message'
	},
	{
		title: '儿保记录',
		icon: 'icon-my_ProductionRecord1',
		value: '',
		label: '',
		to: '/children/inspection-record'
	},
	...global
];
