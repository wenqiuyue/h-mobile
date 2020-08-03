const policy = require('../../../../assets/mother-child-manual/mother_policy.svg');
const encyclopedias = require('../../../../assets/mother-child-manual/mother_Encyclopedias.svg');
const selfRecording = require('../../../../assets/mother-child-manual/mother_selfRecording.svg');
const inspectionRecord = require('../../../../assets/mother-child-manual/mother_InspectionRecord.svg');

export default [
	{
		title: '惠民政策',
		src: policy,
		background: '#FFF3E5',
		to: '/mother/policy'
	},
	{
		title: '孕百科',
		src: encyclopedias,
		background: '#E3FAF1',
		to: '/mother/pregnant-encyclopedia'
	},
	{
		title: '自我记录',
		src: selfRecording,
		background: '#FEEFEF',
		to: '/mother/self-recording'
	},
	{
		title: '检查记录',
		src: inspectionRecord,
		background: '#E0F8FE',
		to: '/mother/prenatal-record'
	}
];
