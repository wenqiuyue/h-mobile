import { version } from '../fetch/version';
import { fetchGet, fetchPost } from '../fetch';

/**
 * 根据TipVal值获取站点提示
 * ..param tipVal
 * ..constructor
 */
export function GetByTipVal(tipVal) {
	return fetchGet(`/v${version}/TipConfigs/GetByTipVal/${tipVal}`);
}

/**
 * 根据TipVal数组值获取站点提示
 * ..constructor
 * ..param tipVals
 */
export function GetByTipVals(tipVals) {
	return fetchPost(`/v${version}/TipConfigs/GetByTipVals`, tipVals);
}
