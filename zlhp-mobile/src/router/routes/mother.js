export default {
	path: '/mother',
	name: 'mother',
	component: () =>
		import(/* webpackChunkName: "mother" */ '../../components/container'),
	children: [
		// 产检记录
		{
			path: 'prenatal-record',
			name: 'mother-prenatal-record',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/prenatal-record'
				),
			meta: { requireArchiving: true }
		},
		// 体重记录
		{
			path: 'weight-record',
			name: 'mother-weight-record',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/weight-record'
				),
			meta: { requireArchiving: true }
		},
		// 胎动记录
		{
			path: 'quickening-record',
			name: 'mother-quickening-record',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/quickening-record'
				),
			meta: { requireArchiving: true }
		},
		// 高危评估
		{
			path: 'risk-assessment',
			name: 'mother-risk-assessment',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/risk-assessment'
				),
			meta: { requireArchiving: true }
		},
		// 高危自评
		{
			path: 'high-risk-self-assessment',
			name: 'mother-high-risk-self-assessment',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/high-risk-self-assessment'
				),
			meta: { requireArchiving: true }
		},
		// 保健指导
		{
			path: 'health-instruction',
			name: 'mother-health-instruction',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/health-instruction'
				),
			meta: { requireArchiving: true }
		},
		// 绑定身份
		{
			path: 'binding',
			name: 'mother-binding',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/binding/mother'
				)
		},
		// 自主建档
		{
			path: 'archiving',
			name: 'mother-archiving',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/archiving/mother'
				)
		},
		// 查看报告
		{
			path: 'inspection',
			name: 'mother-inspection',
			component: () =>
				import(/* webpackChunkName: "mother" */ '../../components/container'),
			children: [
				{
					path: 'check',
					name: 'mother-inspection-check',
					redirect: '/mother/inspection/check/items',
					component: () =>
						import(
							/* webpackChunkName: "mother" */ '../../components/container'
						),
					children: [
						{
							path: 'items',
							name: 'mother-inspection-check-items',
							component: () =>
								import(
									/* webpackChunkName: "mother" */ '../../views/modules/inspection-check'
								)
						},
						// 查看报告详情
						{
							path: 'details',
							name: 'mother-inspection-check-details',
							component: () =>
								import(
									/* webpackChunkName: "mother" */ '../../views/modules/inspection-check/details'
								)
						},
						// 查看报告PDF
						{
							path: 'pdf',
							name: 'mother-inspection-check-pdf',
							component: () =>
								import(
									/* webpackChunkName: "mother" */ '../../views/modules/inspection-check/pdf'
								)
						}
					]
				}
			]
		},
		// 我的档案
		{
			path: 'my-archive',
			name: 'mother-my-archive',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/my-archive/mother'
				)
		},
		// 孕妈学校
		{
			path: 'mother-school',
			name: 'mother-school',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/mother-school'
				),
			meta: { requireArchiving: true }
		},
		// 课程介绍
		{
			path: 'course-introduction',
			name: 'mother-course-introduction',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/course-introduction'
				)
		},
		// 讲师列表
		{
			path: 'teacher-list',
			name: 'mother-teacher-list',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/teacher-list'
				)
		},
		// 讲师介绍
		{
			path: 'teacher-introduction',
			name: 'mother-teacher-introduction',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/teacher-introduction'
				)
		},
		// 孕妇学校课程签到
		{
			path: 'mother-school-sign-in',
			name: 'mother-school-sign-in',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/mother-school-sign-in'
				)
		},
		// 我的课程
		{
			path: 'my-sign-up',
			name: 'mother-my-sign-up',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/my-sign-up'
				),
			meta: { requireArchiving: true }
		},
		// 问诊医生列表
		{
			path: 'interrogation-doctor-list',
			name: 'mother-interrogation-doctor-list',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/interrogation-doctor-list'
				),
			meta: { requireArchiving: true }
		},
		// 问诊全部口碑
		{
			path: 'interrogation-public-praise',
			name: 'mother-interrogation-public-praise',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/interrogation-public-praise'
				)
		},
		// 问诊医生详情
		{
			path: 'interrogation-doctor-info',
			name: 'mother-interrogation-doctor-info',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/interrogation-doctor-info'
				)
		},
		// 问诊发表评价
		{
			path: 'interrogation-publication-evaluation',
			name: 'mother-interrogation-publication-evaluation',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/interrogation-publication-evaluation'
				)
		},
		// 图文问诊
		{
			path: 'interrogation-teletext',
			name: 'mother-interrogation-teletext',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/interrogation-teletext'
				)
		},
		// 我的问诊
		{
			path: 'interrogation-my-inquisition',
			name: 'mother-interrogation-my-inquisition',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/interrogation-my-inquisition'
				),
			meta: { requireArchiving: true }
		},
		// 问诊详情
		{
			path: 'interrogation-details-inquiring',
			name: 'mother-interrogation-details-inquiring',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/interrogation-details-inquiring'
				)
		},
		// 快速问诊
		{
			path: 'interrogation-rapid-interrogation',
			name: 'mother-interrogation-rapid-interrogation',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/interrogation-rapid-interrogation'
				)
		},
		// 产检计划
		{
			path: 'production-inspection-plan',
			name: 'mother-production-inspection-plan',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/production-inspection-plan'
				),
			meta: { requireArchiving: true }
		},
		// 支付页面
		{
			path: 'interrogation-pay-page',
			name: 'mother-interrogation-pay-page',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/interrogation-pay-page'
				),
			meta: { requireArchiving: true }
		},
		// 产检详情
		{
			path: 'production-inspection-info',
			name: 'mother-production-inspection-info',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/production-inspection-info'
				)
		},
		// 预约须知
		{
			path: 'notice',
			name: 'mother-notice',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/make-appointment/notice'
				)
		},
		// 选择就诊人
		{
			path: 'select-patient',
			name: 'mother-select-patient',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/make-appointment/select-patient'
				)
		},
		// 添加就诊人
		{
			path: 'add-patient',
			name: 'mother-add-patient',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/make-appointment/add-patient'
				)
		},
		// 选择科室
		{
			path: 'select-department',
			name: 'mother-select-department',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/make-appointment/select-department'
				)
		},
		// 选择就诊时间
		{
			path: 'select-time',
			name: 'mother-select-time',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/make-appointment/select-time'
				)
		},
		// 预约挂号信息确认
		{
			path: 'information-confirmation',
			name: 'mother-information-confirmation',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/make-appointment/information-confirmation'
				)
		},
		// 挂号记录
		{
			path: 'registration-record',
			name: 'mother-registration-record',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/make-appointment/registration-record'
				)
		},
		// 就诊人列表
		{
			path: 'patient-manage',
			name: 'mother-patient-manage',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/make-appointment/patient-manage'
				)
		},
		// 就诊人详情
		{
			path: 'patient-info',
			name: 'mother-patient-info',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/make-appointment/patient-info'
				)
		},
		// 预约成功
		{
			path: 'appointment-success',
			name: 'mother-appointment-success',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/make-appointment/appointment-success'
				)
		},
		// 扫码签到
		{
			path: 'code-sign-in',
			name: 'mother-code-sign-in',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/make-appointment/code-sign-in'
				)
		},
		// 母子健康手册自我记录
		{
			path: 'self-recording',
			name: 'mother-self-recording',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/mother-child-manual/self-recording'
				),
			meta: { requireArchiving: true }
		},
		// 母子健康手册记录后
		{
			path: 'recording-after',
			name: 'mother-recording-after',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/mother-child-manual/recording-after'
				)
		},
		// 母子健康手册记录
		{
			path: 'recording',
			name: 'recording',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/mother-child-manual/recording'
				)
		},
		// 母子健康手册惠民政策
		{
			path: 'policy',
			name: 'policy',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/mother-child-manual/policy'
				)
		},
		// 母子健康手册孕百科
		{
			path: 'pregnant-encyclopedia',
			name: 'pregnant-encyclopedia',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/mother-child-manual/pregnant-encyclopedia'
				)
		},
		// 母子健康手册孕百科详情
		{
			path: 'pregnant-encyclopedia-info',
			name: 'pregnant-encyclopedia-info',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/mother-child-manual/pregnant-encyclopedia-info'
				)
		},
		// 母子健康手册孕妇学校学习记录
		{
			path: 'learning-records',
			name: 'learning-records',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/mother-child-manual/learning-records'
				)
		},
		// 母子健康手册孕妇学校看笔记
		{
			path: 'look-notes',
			name: 'look-notes',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/mother-child-manual/look-notes'
				)
		},
		// 母子健康手册
		{
			path: 'mother-child-manual-index',
			name: 'mother-child-manual-index',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/mother-child-manual/mother-child-manual-index'
				)
		},
		// 母子健康手册自我记录表单
		{
			path: 'recording-form',
			name: 'recording-form',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/mother-child-manual/recording-form'
				)
		},
		// 母子健康手册记笔记
		{
			path: 'take-notes',
			name: 'take-notes',
			component: () =>
				import(
					/* webpackChunkName: "mother" */ '../../views/modules/mother-child-manual/take-notes'
				)
		}
	]
};
