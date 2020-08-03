import { version } from '../fetch/version';
import { fetchGet, fetchPost, fetchPut } from '../fetch';

/**
 * 获取科室列表
 */
export function getDeparts(DepartID) {
	return fetchGet(`/v${version}/HisBespeak/GetDeparts`, {
		params: { DepartID }
	});
}

/**
 * 获取号源
 */
export function getSchedulingInfo(id, param) {
	return fetchPost(`/v${version}/HisBespeak/GetSchedulingInfo/${id}`, param);
}

/**
 * 取消预约(未缴费)
 */
export function appointmentRegisterCancelNoPay(id) {
	return fetchPut(
		`/v${version}/HisBespeak/AppointmentRegisterCancelNoPay/${id}`
	);
}

/**
 * 预约(未缴费)
 */
export function appointmentRegisterNoPay(param) {
	return fetchPost(`/v${version}/HisBespeak/AppointmentRegisterNoPay`, param);
}
