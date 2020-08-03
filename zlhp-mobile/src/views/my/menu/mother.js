import global from './global';

export default [
	{
		title: '就诊人管理',
		icon: 'icon-my-patient',
		value: '',
		label: '',
		to: '/mother/patient-manage'
	},
	{
		title: '我的预约',
		icon: 'icon-my-appointment',
		value: '',
		label: '',
		to: '/mother/registration-record'
	},
	{
		title: '孕期管理',
		icon: 'icon-my_Pregnancy1',
		value: '',
		label: '',
		to: '/archive/list?editor'
	},

	{
		title: '产检记录',
		icon: 'icon-my_ProductionRecord1',
		value: '',
		label: '',
		to: '/mother/prenatal-record'
	},
	// {
	// 	title: '我的课程',
	// 	icon: 'icon-my_Curriculum1',
	// 	value: '',
	// 	label: '',
	// 	to: '/mother/my-sign-up'
	// },
	{
		title: '问诊记录',
		icon: 'icon-my-consultation',
		value: '',
		label: '',
		to: '/mother/interrogation-my-inquisition'
	},
	{
		title: '消息通知',
		icon: 'icon-my_news1',
		value: '',
		label: '',
		to: '/message'
	},
	...global
];
