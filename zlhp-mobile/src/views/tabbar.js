/**
 * icon : 图标名称或图片链接
 * name : 标签名称，作为匹配的标识符
 * title: 标题
 * to   : 点击后跳转的目标路由对象，同 vue-router 的 to 属性
 * dot  : 是否显示图标右上角小红点
 * info : 图标右上角徽标的内容
 */
export default {
	mother: [
		{
			icon: {
				active: 'icon-Fill_home',
				inactive: 'icon-home1'
			},
			name: 'home',
			title: '首页',
			to: '/home',
			dot: false,
			info: ''
		},
		{
			icon: {
				active: 'icon-Fill_notice',
				inactive: 'icon-notice1'
			},
			name: 'message',
			title: '消息',
			to: '/message',
			dot: false,
			info: ''
		},
		{
			icon: {
				active: 'icon-Fill_my',
				inactive: 'icon-my1'
			},
			name: 'my',
			title: '我的',
			to: '/my',
			dot: false,
			info: ''
		}
	],
	children: [
		{
			icon: {
				active: 'icon-babyFill_home',
				inactive: 'icon-babyHome'
			},
			name: 'children-home',
			title: '首页',
			to: '/children/home',
			dot: false,
			info: ''
		},
		{
			icon: {
				active: 'icon-babyFill_notice',
				inactive: 'icon-babyNotice'
			},
			name: 'children-message',
			title: '消息',
			to: '/children/message',
			dot: false,
			info: ''
		},
		{
			icon: {
				active: 'icon-babyFill_my',
				inactive: 'icon-babyMy'
			},
			name: 'children-my',
			title: '我的',
			to: '/children/my',
			dot: false,
			info: ''
		}
	]
};
