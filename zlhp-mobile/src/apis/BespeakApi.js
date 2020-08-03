import { version } from '../fetch/version';
import { fetchGet, fetchPost } from '../fetch';

/**
 * 初始化一卡通
 */
export function InitOneCard() {
	return fetchGet(`/v${version}/HisBespeak/InitOneCard`);
}

/**
 * 获取排班信息
 * ..param today
 * ..param date
 */
export function GetSchedulingInfo(today, date) {
	if (date !== undefined && date !== null && date !== 'undefined') {
		return fetchGet(
			`/v${version}/HisBespeak/GetSchedulingInfo/${today}/${date}`
		);
	}
	return fetchGet(`/v${version}/HisBespeak/GetSchedulingInfo/${today}`);
}

/**
 * 今日挂号锁号
 * ..param {Object} params
 */
export function TodayRegisteredNumberLock(params) {
	return fetchPost(`/v${version}/HisBespeak/TodayRegisteredNumberLock`, params);
}

/**
 * 今日挂号锁号支付
 * ..param {Object} params
 */
export function TodayRegisteredNumberLockPay(params) {
	return fetchPost(
		`/v${version}/HisBespeak/TodayRegisteredNumberLockPay`,
		params
	);
}

/**
 * 今日挂号锁号取消
 * ..param id
 */
export function TodayRegisteredNumberLockCancel(id) {
	return fetchGet(
		`/v${version}/HisBespeak/TodayRegisteredNumberLockCancel/${id}`
	);
}

/**
 * 预约挂号
 * ..param {Object} params
 */
export function AppointmentRegister(params) {
	return fetchPost(`/v${version}/HisBespeak/AppointmentRegister`, params);
}

/**
 * 预约挂号删除
 * ..param id
 */
export function AppointmentRegisterDelete(id) {
	return fetchGet(`/v${version}/HisBespeak/AppointmentRegisterDelete/${id}`);
}

/**
 * 预约挂号取号支付
 * ..param {Object} params
 */
export function AppointmentRegisterPay(params) {
	return fetchPost(`/v${version}/HisBespeak/AppointmentRegisterPay`, params);
}

/**
 * 退款
 * ..param {Object} id
 */
export function ReturnPremium(id) {
	return fetchGet(`/v${version}/HisBespeak/ReturnPremium/${id}`);
}

/**
 * 今日挂号锁号 或 预约挂号删除
 */
export function TodayRegisteredNumberLockCancelOrAppointmentRegisterDelete(id) {
	return fetchGet(
		`/v${version}/HisBespeak/TodayRegisteredNumberLockCancelOrAppointmentRegisterDelete/${id}`
	);
}

/**
 * 排队信息查询
 * ..param ghd
 * ..returns {*|Promise|Promise<any>}
 * ..constructor
 */
export function Queue(ghd) {
	return fetchGet(`/v${version}/HisBespeak/Queue/${ghd}`);
}

/**
 * 是否为用户的卡号
 * ..param type 1:孕产妇 2:儿童
 * ..param cardNo
 * ..constructor
 */
export function IsUserCardNo(type, cardNo) {
	return fetchGet(`/v${version}/HisBespeak/IsUserCardNo/${type}/${cardNo}`);
}

/**
 * 签到
 * ..param params
 * ..returns {Promise<unknown>}
 * ..constructor
 */
export function SignIn(params) {
	return fetchPost(`/v${version}/HisBespeak/SignIn`, params);
}
