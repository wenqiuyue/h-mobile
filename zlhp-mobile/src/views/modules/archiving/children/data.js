// 行政区划基础字段
const baseAreaField = ['Province', 'City', 'District', 'Village', 'Community'];

/**
 * 现地址字段名
 * @type {string[]}
 */
export const curAreaKeys = baseAreaField;

/**
 * 户籍地址字段名
 * @type {string[]}
 */
export const regAreaKeys = baseAreaField.map(v => `Reg${v}`);

/**
 * 表单对象
 * @type {Object}
 */
export const form = {
	ChildrenArchiveID: 0,
	// 母亲信息
	MotherIdType: 1, // 母亲证件类型
	MotherIdNumber: null, // 母亲证件号
	MotherBirthDate: new Date(
		new Date().setFullYear(new Date().getFullYear() - 20)
	), // 母亲出生日期
	MotherName: null, // 母亲姓名
	MotherPhone: null, // 母亲手机号
	MotherProfession: null, // 母亲职业
	// 父亲信息
	FatherIdType: 1, // 父亲证件类型
	FatherIdNumber: null, // 父亲证件号
	FatherBirthDate: new Date(
		new Date().setFullYear(new Date().getFullYear() - 22)
	), // 父亲出生日期
	FatherName: null, // 父亲姓名
	FatherPhone: null, // 父亲手机号
	FatherProfession: null, // 父亲职业
	// 其他监护人
	OtherGuardian: null, // 其他监护人
	OtherGuardianPhone: null, // 其他监护人手机号
	// 儿童信息
	Name: null, // 姓名
	ChildrenIdType: 1, // 儿童证件类型
	IdNumber: null, // 证件号
	BirthDate: null, // new Date(new Date().setDate(new Date().getDate() - 42)),  // 出生日期
	BirthDateMax: new Date(),
	Sex: 1, // 性别
	FirstFew: 1, // 多胎序号
	Race: 1, // 民族
	IsInflow: 0, // 流入
	IsFlow: 0, // 流动人口
	RegProvince: null, // 户口省份
	RegCity: null, // 户口城市
	RegDistrict: null, // 户口区县
	RegVillage: null, // 户口乡镇
	RegCommunity: null, // 户口居委会
	RegAddress: null, // 户口地址
	RegAddressInfo: null, // 户口地址详情
	RegAreaID: null, // 户口区域ID
	Province: null, // 现居省份
	City: null, // 现居城市
	District: null, // 现居区县
	Village: null, // 现居乡镇
	Community: null, // 现居居委会
	CurrAddress: null, // 现居地址
	CurrAddressInfo: null, // 现居地址详情
	AreaID: null, // 现居区域ID
	Remark: null, // 备注
	BirthWeek: null, // 分娩孕周
	BirthDay: null, // 分娩孕天
	BirthBodyHeignt: null, // 出生身长
	BirthBodyWeight: null, // 出生体重
	BirthAddress: null, // 出生地点
	FetalTimes: null, // 第几胎
	BirthTimes: null, // 第几产
	BirthSituation: [], // 出生情况
	HearingScreening: null, // 听力筛查
	NewbornApnea: null, // 新生儿窒息
	NewbornMalformation: null, // 新生儿畸形
	NewbornMalformationRemark: null // 新生儿畸形备注
};

export default {
	form,
	curAreaKeys,
	regAreaKeys
};
