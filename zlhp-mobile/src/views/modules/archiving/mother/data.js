// 行政区划基础字段
const baseAreaField = ['Province', 'City', 'District', 'Village', 'Community'];

/**
 * 现地址字段名
 * @type {[string, string, string, string, string]}
 */
export const curAreaKeys = baseAreaField; //

/**
 * 休养地址字段名
 * @type {string[]}
 */
export const restAreaKeys = baseAreaField.map(v => `Rest${v}`);

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
	Name: null,
	IdType: 1,
	IDNumber: null,
	BodyWeight: null,
	Stature: null,
	Employer: null,
	Phone: null,
	Race: 1,
	Educational: null,
	Profession: null,
	MaritalStatus: 2,
	MarriageAge: null, // 基本信息 end
	ContactRelationship: 0,
	BloodABO: null,
	BloodRH: null,
	HusName: null,
	HusAge: null,
	HusPhone: null,
	HusIdType: 1,
	HusIDNumber: null,
	HusCountry: 59,
	HusRace: 1,
	HusEducational: null, // 10本科
	HusProfession: null, // 3商务人员
	HusEmployer: null,
	HusBloodABO: 5,
	HusBloodRH: 3,
	HusPhysicalCondition: 2,
	IsHusPast: 0,
	HusPastDisease: null,
	IsHusPulmonaryDisease: 0,
	HusPulmonaryDisease: null,
	IsHusKidneyDisease: 0,
	HusKidneyDisease: null,
	HusSomking: 0,
	HusDrink: 0, // 联系人信息 end
	HusHBV: null,
	ExaminationInfo: {
		IsOralFolicAcid: 0, // 是否口服叶酸
		HCGPositiveDays: null, // HCG阳性停经天数
		IsHeat: 0, // 是否发热
		HeatSymptom: '', // 发热伴随症状
		IsVaginalBleeding: 0, // 阴道出血
		VBSymptom: '', // 阴道出血伴随症状
		PhysicalHarmfuls: [0], // 接触物理性有害因素
		OtherPhysical: '', // 其他物理有害因素
		IndustrialPoisons: [0], // 接触高浓度工业毒物
		OtherIndustria: '', // 其他高浓度工业毒物
		IsKeepPet: 0, // 家养宠物
		IsNewDecoration: 0, // 环境新装修
		IsDrink: 0, // 是否饮酒
		DrinkML: null, // 饮酒量
		IsSomke: 0, // 是否吸烟
		SmokeAge: null, // 烟龄
		SmokeTimes: null, // 每天平均多少支
		IsDrug: 0, // 是否吸毒
		ViralInfection: [], // 病毒感染
		ViralInfectionTime: null, // 病毒感染时间
		OtherHarmfuls: '', // 其他有害因素
		Medications: []
	},

	GestationHistories: {
		PregnancyTimes: 1,
		BirthTimes: 0,
		VaginalDeliveryTimes: 0,
		CaesareanDeliveryTimes: 0,
		Girls: 0,
		Boys: 0,
		MiscarriageTimes: 0,
		AbortionTimes: 0,
		PrematureLaborTimes: 0,
		StillBirthTimes: 0,
		NewbornDeathTimes: 0,
		LastAbortionDate: null,
		LastBirthDate: null,
		IsBirthDefect: 0,
		IsComplication: 0 // 孕产史 end
		// GestationHistoryRecords: [] // 孕产史记录
	},
	MenstrualHistories: {
		LastMenstrualDate: null,
		MenarcheAge: null,
		MenstrualCycle: null,
		MenstrualCycleMin: null,
		MenstrualCycleMax: null,
		MenstrualPeriod: null,
		MenstrualPeriodMin: null,
		MenstrualPeriodMax: null,
		MenarcheBV: null,
		Dysmenorrhea: null,
		IsBloodClot: 0,
		IsMenarcheColor: 1,
		MenarcheColorAbnormal: '' // 月经色异常

		// 月经史 end
	},
	PastHistory: [0],
	OtherPast: '', // 既往史 end
	IsDrugAllergyHistory: null, // 药物过敏史
	DrugAllergyHistory: '', // 药物过敏史情况
	FamilyHistory: [0],
	OtherFamilyHistory: '', // 家族史 end
	SurgeryHistory: [0],
	OtherSurgery: '', // 家族史 end
	PersonHistory: [0],
	OtherPersonHistory: '', // 手术史 end
	Province: null,
	City: null,
	District: null,
	Village: null,
	Community: null,
	CurrAddress: null,
	CurrAddressInfo: null,
	RestProvince: null,
	RestCity: null,
	RestDistrict: null,
	RestVillage: null,
	RestCommunity: null,
	RestAddress: null,
	RestAddressInfo: null,
	RegProvince: null,
	RegCity: null,
	RegDistrict: null,
	RegVillage: null,
	RegCommunity: null,
	RegAddress: null,
	RegAddressInfo: null // 行政区划 end
};

export default {
	form,
	curAreaKeys,
	regAreaKeys,
	restAreaKeys
};
