// 甜蜜时刻
const SweetMomentone = require('../../../../assets/mother-child-manual/SweetMoment_one.png');
const SweetMomenttwo = require('../../../../assets/mother-child-manual/SweetMoment_two.png');
const SweetMomentthree = require('../../../../assets/mother-child-manual/SweetMoment_three.png');

export const sweetTime = [
	{
		title: '听到当妈妈',
		src: SweetMomentone,
		to: ''
	},
	{
		title: '听到胎心音',
		src: SweetMomenttwo,
		to: ''
	},
	{
		title: '感受胎动',
		src: SweetMomentthree,
		to: ''
	}
];
// 孕期自我记录
export const recording = [
	{
		title: '孕1-3月自我记录',
		to: '',
		value: ''
	},
	{
		title: '孕4-7月自我记录',
		to: '',
		value: ''
	},
	{
		title: '孕8-10月自我记录',
		to: '',
		value: ''
	}
];
// 情况记录
const readingBook = require('../../../../assets/mother-child-manual/mother_Illustration_readingBook.svg');
const polaroid = require('../../../../assets/mother-child-manual/polaroid.svg');
const checklist = require('../../../../assets/mother-child-manual/mother_checklist.svg');

export const select = [
	{
		title: '孕妇学校听课记录',
		src: readingBook,
		to: ''
	},
	{
		title: '分娩情况自我记录',
		src: polaroid,
		to: ''
	},
	{
		title: '产褥期情况自我记录',
		src: checklist,
		to: ''
	}
];
export default {
	sweetTime,
	recording,
	select
};
