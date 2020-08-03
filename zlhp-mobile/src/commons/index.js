import QRCode from 'qrcodejs2';
import JsBarcode from 'jsbarcode';
import nzh from 'nzh';
/**
 * 设置文档/页面标题
 * @param title
 */
export function setDocumentTitle(title = '慧生养') {
	document.title = title;

	// iphone|ipod|ipad 浏览器标题处理
	if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
		const i = document.createElement('iframe');
		i.src = '/favicon.ico';
		i.style.display = 'none';
		i.onload = () => {
			setTimeout(() => {
				i.remove();
			}, 9);
		};
		document.body.appendChild(i);
	}
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function gcj02ToBd09(lng, lat) {
	// 定义一些常量
	const XPI = (3.14159265358979324 * 3000.0) / 180.0;
	const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * XPI);
	const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * XPI);
	const bdLng = z * Math.cos(theta) + 0.0065;
	const bdLat = z * Math.sin(theta) + 0.006;
	return [bdLng, bdLat];
}

/**
 * 获取年龄
 */
export function getAge(UUserCard) {
	const myDate = new Date();
	const month = myDate.getMonth() + 1;
	const day = myDate.getDate();
	let age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
	if (
		UUserCard.substring(10, 12) < month ||
		(UUserCard.substring(10, 12) === month &&
			UUserCard.substring(12, 14) <= day)
	) {
		age += 1;
	}
	return age;
}

/**
 * 获取孕周
 *
 * @param {date} date
 */
export function getGestationalWeek(date) {
	let day =
		(new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24);
	day = Math.ceil(day);
	const result = Math.floor(day / 7);
	return result > 42 ? 0 : result;
}

/**
 * 获取剩余孕天
 *
 * @param {date} date
 */
export function getGestationalDay(date) {
	let day =
		(new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24);
	day = Math.ceil(day);
	const result = Math.floor(day / 7);
	return result > 42 ? 0 : day % 7;
}

/**
 * 获取全部孕天
 * @param {date} date
 */
export function getGestationalAllDay(date) {
	let day =
		(new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24);
	day = Math.ceil(day);
	return day;
}

/**
 * 获取孕期孕周孕天标题
 * @param LastMenstrualDate
 * @returns {string|null}
 */
export function getGestationalWeekAndDayTitle(LastMenstrualDate) {
	if (!LastMenstrualDate) {
		return null;
	}
	const week = getGestationalWeek(LastMenstrualDate);
	const day = getGestationalDay(LastMenstrualDate);
	if (week === 0) {
		return `${day}天`;
	}
	if (day === 0) {
		return `${week}周`;
	}
	if (day !== 0 && week !== 0) {
		return `${week}周 +${day}天`;
	}
	return '';
}
/**
 * 根据天数计算孕周（天）
 * @param {*} int
 */
export function getWeekDay(data) {
	const week = Math.floor(data / 7);
	const day = Math.floor(data % 7);
	if (week === 0) {
		return `${day}天`;
	}
	if (day === 0) {
		return `${week}周`;
	}
	if (day !== 0 && week !== 0) {
		return `${week}周+${day}天`;
	}
	return '';
}
/**
 * 获取预产期天数
 * @param {date} date
 */
export function getDueDay(date) {
	if (date) {
		const day =
			(new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
		return Math.ceil(day);
	}
	return -1;
}

/**
 * 身份证加密
 * @param idcard
 * @returns {null}
 */
export function idCordEncrypt(idcard) {
	if (idcard) {
		// 15位身份证举例：130503 670401 001的含义; 13为河北，05为邢台，03为桥西区，出 生日期为1967年4月1日，顺序号为001。
		if (idcard.length === 15) {
			return idcard.replace(/(\d{6})\d{6}(\d{3})/, '$1******$2');
		}
		return idcard.replace(/(\d{5})\d{6}(\d{6})/, '$1******$2');
	}
	return null;
}

/**
 * 获取高危颜色
 * @param level
 * @returns {string}
 */
export function getRiskColor(level) {
	let key = 'default';
	const MAP = {
		default: '',
		绿色: 'green',
		黄色: 'yellow',
		橙色: 'orange',
		红色: 'red',
		紫色: 'purple'
	};
	if (level) {
		// eslint-disable-next-line prefer-destructuring
		key = level.split('、').slice(-1)[0];
	}
	return MAP[key];
}

/**
 * 获取身份证号码中的出生日期
 * @param idCard
 */
export function getBirthDateByIdCard(idCard) {
	if (idCard) {
		let birthday = '';
		if (idCard.length === 15) {
			birthday = `19${idCard.slice(6, 12)}`;
		} else if (idCard.length === 18) {
			birthday = idCard.slice(6, 14);
		}
		birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-');
		return birthday;
	}
	return null;
}
/** 数字转文字 */
export function changeNum(num) {
	const nzhcn = nzh.cn;
	return nzhcn.encodeS(num);
}
/**
 * 从生日中获取年龄
 * @param date：指的是出生日期，格式为"1990-01-01"
 * @return {string}
 */
export function getAgeByBirthDate(date) {
	const birthDay = new Date(date);
	const nowDate = new Date();
	const date1 = Date.parse(birthDay.toString());
	const date2 = Date.parse(nowDate.toString());
	const day = Math.ceil((date2 - date1) / (60 * 60 * 1000 * 24));
	const year = Math.floor(day / 365);
	const y = day % 365;
	const month = Math.floor(y / 30);
	const d = Math.floor((day % 365) % 30);

	if (year > 0) {
		return `${year}岁${month}月`;
	}
	if (month === 0) {
		return `${d}天`;
	}
	return `${month}月${d}天`;
}

/**
 * 从身份证中获取年龄
 */
export function getAgeByIdCard(idCard) {
	if (idCard) {
		let birthday = '';
		if (idCard.length === 15) {
			birthday = `19${idCard.slice(6, 12)}`;
		} else if (idCard.length === 18) {
			birthday = idCard.slice(6, 14);
		}
		birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-');
		const birthDay = new Date(birthday);
		const nowDate = new Date();
		const date1 = Date.parse(birthDay.toString());
		const date2 = Date.parse(nowDate.toString());
		const day = Math.ceil((date2 - date1) / (60 * 60 * 1000 * 24));
		const year = Math.floor(day / 365);
		return year;
	}
	return null;
}

/**
 * canvas 转 image
 * @param canvas DOM 对象
 */
export function convertCanvasToImage(canvas) {
	const image = new Image();
	image.src = canvas.toDataURL('image/png');
	return image;
}

/**
 * 绑定二维码到页面
 * @param el 绑定到的元素
 * @param text 二维码文本
 * @param noTransition 不转换Canvas为Image
 */
export function bindQRCode(el, text, codeWidth, codeHeight, noTransition) {
	// eslint-disable-next-line no-new
	new QRCode(el, {
		text,
		width: codeWidth,
		height: codeHeight,
		colorDark: '#333333', // 二维码颜色
		colorLight: '#ffffff', // 二维码背景色
		correctLevel: QRCode.CorrectLevel.L // 容错率，L/M/H
	});
	if (!noTransition) {
		// 在小米或者华为手机上生成的二维码是通过canvas展示的，img标签被隐藏,所以需要特殊处理一下，将canvas标签隐藏，拿到生成的url放到img里面再展示出来
		const myCanvas = el.getElementsByTagName('canvas')[0];
		const img = convertCanvasToImage(myCanvas);
		// eslint-disable-next-line no-param-reassign
		el.innerHTML = null;
		el.appendChild(img);
	}
}

/**
 * 绑定条形码到页面
 * @param selector 选择器
 * @param text 文本
 */
export function bindBarCode(selector, text) {
	// eslint-disable-next-line no-new
	new JsBarcode(selector, text, {
		format: 'CODE39', // 选择要使用的条形码类型
		width: 1, // 设置条之间的宽度
		height: 50, // 高度
		displayValue: true, // 是否在条形码下方显示文字
		textAlign: 'center', // 设置文本的水平对齐方式
		textMargin: 5, // 设置条形码和文本之间的间距
		fontSize: 20, // 设置文本的大小
		margin: 0 // 设置条形码周围的空白边距
	});
}

/**
 *通过开始时间和时长换算结束时间
 这个开始时间获取出来的是一个字符串的时间，所以换算结束时间时，直接切割了时分秒，然后加上时长
 * @param beginTime 开始是时间
 * @param duration 时长
 */
export function endTime(beginDay, beginTime, duration) {
	const date = new Date(
		`${new Date(beginDay).format('yyyy-MM-dd')} ${beginTime}`
	);
	const min = date.getMinutes();
	date.setMinutes(min + duration);
	return date;
}

/**
 * 计算总毫秒数
 *
 */
export function sumMillisecond(time) {
	const date = new Date();
	const timeDate = new Date(time);
	const dateH = date.getHours();
	const dateM = date.getMinutes();
	const timeDateH = timeDate.getHours();
	const timeDateM = timeDate.getMinutes();
	// const keyArray = time.split(':').map(s => {
	// 	return parseInt(s, 0);
	// });
	const sunTime = ((timeDateH - dateH) * 360 + (timeDateM - dateM) * 6) * 10000;
	return sunTime;
}
/**
 * 结果处理程序
 */
export function disposeResult(
	opts = {
		$vm: null, // 调用界面的 this
		response: null, // Promise 结果
		key: null, // 实例的键
		parser: null, // 数据处理程序
		onlyData: false // 结果是否仅数据
	}
) {
	const dispose = data => {
		if (opts.parser && typeof opts.parser === 'function') {
			data = opts.parser(data);
		}
		if (opts.key instanceof Array) {
			opts.$vm.$set(opts.$vm[opts.key[0]], opts.key[1], data);
		} else {
			opts.$vm.$set(opts.$vm, opts.key, data);
		}
	};

	if (opts.onlyData) {
		dispose(opts.response);
	} else if (opts.response.Code === 0) {
		dispose(opts.response.Body);
	}
}
