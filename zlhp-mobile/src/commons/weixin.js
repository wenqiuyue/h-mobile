import wx from 'weixin-js-sdk';
import uuid from 'uuid';
import { gcj02ToBd09 } from './index';
import { version } from '../fetch/version';
import * as WeiXinApi from '../apis/WeiXinApi';
import { isWeChatBrowser } from '../tools';

/**
 * 设置位置到服务器
 * @param UUID 定位UUID
 * @param distance getDistance方法获取的数据
 * @returns {Promise<unknown>}
 */
export function setLocation(distance, UUID) {
	return new Promise((resolve, reject) => {
		if (distance && distance.errMsg === 'getLocation:ok') {
			const location = gcj02ToBd09(distance.longitude, distance.latitude);
			WeiXinApi.SetLocation({
				Longitude: location[0],
				Latitude: location[1],
				Precision: distance.accuracy,
				Uuid: UUID
			})
				.then(response => {
					if (response.Code === 0) {
						resolve(response);
					} else {
						reject();
					}
				})
				.catch(reject);
		} else {
			reject();
		}
	});
}

/**
 * 打开相机
 * @returns {Promise<unknown>}
 * @constructor
 */
export function OpenCamera() {
	return new Promise((resolve, reject) => {
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original', 'compressed'], // 指定是原图还是压缩图，默认都有
			sourceType: ['album', 'camera'], // 指定来源是相册还是相机，默认都有
			success: response => {
				const { localIds } = response; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
				wx.uploadImage({
					localId: localIds.toString(), // 需要上传的图片的ID，由chooseImage接口获得
					isShowProgressTips: 1, // 进度提示
					success: res => {
						const mediaId = res.serverId; // 返回图片的服务器端ID，即mediaId
						// 将获取到的 mediaId 传入后台 方法savePicture
						WeiXinApi.GetCardNo(mediaId).then(resolve);
					},
					fail: reject
				});
			},
			cancel: reject
		});
	});
}

/**
 * 授权
 * @param token 用户TOKEN
 * @param path 授权完成后跳转的地址
 * @constructor
 */
export function Auth(token, path) {
	window.location.href = `/v${version}/Account/WxAuth?token=${token}&returnUrl=${process.env.VUE_APP_RETURN_URL}${path}`;
}

/**
 * 微信登录
 * @returns {Promise<unknown>}
 * @constructor
 */
export function Login() {
	const UUID = uuid();

	const skip = () => {
		window.location.href = `/v${version}/Account/WxLogin?uuid=${UUID}&returnUrl=${process.env.VUE_APP_RETURN_URL}/login`;
	};

	const disposeLocation = () => {
		wx.getLocation({
			type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
			success(res) {
				setLocation(res, UUID).finally(skip);
			},
			fail() {
				skip();
			}
		});
	};

	if (!isWeChatBrowser()) {
		skip();
	}

	wx.ready(() => {
		disposeLocation();
	});
	wx.error(() => {
		skip();
	});
}

/**
 * 加载配置文件
 * @returns {Promise<unknown>}
 * @constructor
 */
export function Config() {
	return new Promise((resolve, reject) => {
		if (!isWeChatBrowser()) {
			reject(Error('非微信浏览器'));
		}
		WeiXinApi.GetConfig()
			.then(response => {
				if (response.Code === 0) {
					wx.config({
						// 开启调试模式,调用的所有api的返回值会在客户端alert出来，
						// 若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						debug: false,
						appId: response.Body.AppId, // 必填，公众号的唯一标识
						timestamp: response.Body.Timestamp, // 必填，生成签名的时间戳
						nonceStr: response.Body.NonceStr, // 必填，生成签名的随机串
						signature: response.Body.Signature, // 必填，签名
						jsApiList: [
							'checkJsApi',
							'onMenuShareTimeline',
							'onMenuShareAppMessage',
							'onMenuShareQQ',
							'onMenuShareWeibo',
							'hideMenuItems',
							'showMenuItems',
							'hideAllNonBaseMenuItem',
							'showAllNonBaseMenuItem',
							'translateVoice',
							'startRecord',
							'stopRecord',
							'onRecordEnd',
							'playVoice',
							'pauseVoice',
							'stopVoice',
							'uploadVoice',
							'downloadVoice',
							'chooseImage',
							'previewImage',
							'uploadImage',
							'downloadImage',
							'getNetworkType',
							'openLocation',
							'getLocation',
							'hideOptionMenu',
							'showOptionMenu',
							'closeWindow',
							'scanQRCode',
							'chooseWXPay',
							'openProductSpecificView',
							'addCard',
							'chooseCard',
							'openCard',
							'setNavigationBarButtons'
						] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2。详见：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
					});
					wx.error(error => {
						reject(error);
					});
					wx.ready(() => {
						resolve();
					});
				} else {
					reject();
				}
			})
			.catch(error => reject(error));
	});
}

/**
 * 获取定位
 */
export function getDistance() {
	return new Promise((resolve, reject) => {
		wx.getLocation({
			type: 'gcj02',
			success(response) {
				resolve(response);
			},
			fail(error) {
				reject(error);
			}
		});
	});
}

/**
 * 微信支付
 * @param params
 * @returns {Promise<unknown>}
 */
export function wxPayment(params) {
	return new Promise(resolve => {
		const onBridgeReady = () => {
			window.WeixinJSBridge.invoke(
				'getBrandWCPayRequest',
				{
					appId: params.appId, // 公众号名称，由商户传入
					timeStamp: params.timeStamp, // 时间戳，自1970年以来的秒数
					nonceStr: params.nonceStr, // 随机串
					package: params.package,
					signType: params.signType, // 微信签名方式：
					paySign: params.paySign // 微信签名
				},
				res => resolve(JSON.stringify(res))
			);
		};

		if (typeof window.WeixinJSBridge === 'undefined') {
			if (document.addEventListener) {
				document.addEventListener(
					'WeixinJSBridgeReady',
					() => onBridgeReady(),
					false
				);
			} else if (document.attachEvent) {
				document.attachEvent('WeixinJSBridgeReady', () => onBridgeReady());
				document.attachEvent('onWeixinJSBridgeReady', () => onBridgeReady());
			}
		} else {
			onBridgeReady();
		}
	});
}
