import { version } from '../fetch/version';
import { fetchGet } from '../fetch';

/**
 *根据id获取科室
 */
export function getReservationsById(id) {
	return fetchGet(`/v${version}/Reservations/${id}`);
}
