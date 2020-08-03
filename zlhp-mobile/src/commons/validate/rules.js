/**
 * 示例
 * @type {{
 *    params: [string, string],
 *    message: string,
 *    validate: (function(*, {p1: *, p2: *}): boolean|boolean)
 * }}
 */
export const example = {
	/**
	 * 验证方法
	 * @param value 表单值
	 * @param p1 参数1
	 * @param p2 参数2
	 * @returns {boolean|boolean}
	 *
	 * @example
	 *  <ValidationProvider rules="example:p1,p2">
	 */
	validate: (value, { p1, p2 }) => value > p1 && p2 > value,
	params: ['p1', 'p2'], // 接受的参数
	message: '{_field_}必须大于{p1}小于{p2}' // {_field_} 字段名, {_value_} 值, {p1} 参数1, {p2} 参数2
};

/**
 * 错误
 * @type {{params: [string], message: string, validate: (function(*): boolean)}}
 */
export const error = {
	validate: (value, { message }) => !message,
	params: ['message'],
	message: '{_field_}{message}'
};

/**
 * 姓名
 * @type {{message: string, validate: (function(*=): boolean)}}
 */
export const name = {
	validate: value => /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(value),
	message: '{_field_}的格式不正确'
};

/**
 * 手机号
 * @type {{message: string, validate: (function(*=): boolean)}}
 */
export const phone = {
	validate: value =>
		/^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/.test(
			value
		),
	message: '{_field_}的格式不正确'
};

/**
 * 年龄
 * @type {{message: string, validate: (function(*=): boolean)}}
 */
export const age = {
	validate: value => /^((1[0-5])|[1-9])?\d$/.test(value),
	message: '{_field_}的格式不正确'
};

/**
 * 体重
 * @type {{message: string, validate: (function(*=): boolean)}}
 */
export const weight = {
	validate: value =>
		/^(0(\.\d{1}){0,1}|[1-8]\d{1,3}(\.\d{1}){0,1}|9\d{1,2}(\.\d{1}){0,1}|999(\.0){0,1}|.{0})$/.test(
			value
		),
	message: '{_field_}的格式不正确'
};

/**
 * 身高
 * @type {{message: string, validate: (function(*=): boolean)}}
 */
export const stature = {
	validate: value => /^(0{1}|[1-9]\d{0,3}|.{0})$/.test(value),
	message: '{_field_}的格式不正确'
};

/**
 * 军官证
 * @type {{message: string, validate: (function(*=): boolean)}}
 */
export const officerCard = {
	validate: value =>
		/^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/.test(value),
	message: '{_field_}的格式不正确'
};

/**
 * 护照
 * @type {{message: string, validate: (function(*=): boolean)}}
 */
export const passPortCard = {
	validate: value => /^([a-zA-z]|[0-9]){5,17}$/.test(value),
	message: '{_field_}的格式不正确'
};

/**
 * 身份证号
 * @type {{message: string, validate: idCard.validate}}
 */
export const idCard = {
	/**
	 * @param value 身份证字符串
	 * @param gender 数字 0.不指定男女 1.男 2.女 (默认0)
	 * @param strictMode 严格模式 布尔值(是否严格执行验证)
	 *        true:按标准身份证格式验证 false: 只验证一般逻辑(如日期,最后一位是否是数字或x,位数等...) (默认false)
	 * @returns {boolean}
	 * @example
	 * ```javascript
	 *
	 *  //output: true 弱验证此号码是否为男性身份证号码
	 *  console.log(ZV.Utils.isIdCard("500225198411141912", 1));
	 *
	 *  //output: false 强验证此号码是否为男性身份证号码
	 *  console.log(ZV.Utils.isIdCard("500225198411141912", 1, true));
	 */
	validate: (value, { gender, strictMode }) => {
		const trim = str =>
			str && str.toString().replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');

		const isDateString = date =>
			new Date(date).getDate() === parseInt(date.substring(date.length - 2), 0);
		const getDateFromIdCard = number => {
			if (!number) {
				return '';
			}
			try {
				return [
					number.substring(6, 10),
					number.substring(10, 12),
					number.substring(12, 14)
				];
			} catch (e) {
				return '';
			}
		};

		if (!value) {
			return true;
		}
		gender = gender || 0;

		if (gender !== 0 && gender !== 1 && gender !== 2) {
			return false;
		}

		strictMode = strictMode || false;

		if (trim(value) === '') {
			return false;
		}
		value = trim(value && value.toString().replace(/ /g, ''));

		if (value.length !== 18) {
			return false;
		}

		const convertNumber = Number(
			value
				.toString()
				.toLowerCase()
				.replace(/x$/, '10'),
			-1
		);
		if (convertNumber === -1) {
			return false;
		}

		// 男
		if (gender === 1) {
			// 倒数第二位不为奇数, 验证未通过
			if (value[16] % 2 !== 1) {
				return false;
			}
		} else if (gender === 2) {
			// 女
			// 倒数第二位不为奇数, 验证未通过
			if (value[16] % 2 !== 0) {
				return false;
			}
		}

		const birthDate = getDateFromIdCard(value);

		// 弱模式不遵守身份证规则
		if (!strictMode) {
			if (!isDateString(`${birthDate[0]}-${birthDate[1]}-${birthDate[2]}`)) {
				return false;
			}
			if (gender === 0) {
				return true;
			}
			return true;
		}

		const wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
		const valideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
		let sum = 0; // 声明加权求和变量
		if (value[17].toLowerCase() === 'x') {
			value = value.substring(0, 17) + 10;
		} // 将最后位为x的验证码替换为10方便后续操作

		for (let i = 0; i < 17; i += 1) {
			sum += wi[i] * value[i];
		} // 加权求和

		const valCodePosition = sum % 11; // 得到验证码所位置

		return (
			(value.length === 18 &&
				value[17] === valideCode[valCodePosition].toString()) ||
			(value.length === 19 &&
				value.substring(17, 19) === valideCode[valCodePosition].toString())
		);
	},
	message: '{_field_}的格式不正确',
	params: ['gender', 'strictMode ']
};
