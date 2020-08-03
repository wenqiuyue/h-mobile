/**
 * 是否为微信浏览器
 * @returns {boolean}
 */
export function isWeChatBrowser() {
	const ua = window.navigator.userAgent.toLowerCase();
	const matchResult = ua.match(/MicroMessenger/i);
	return matchResult && ua.match(/MicroMessenger/i).includes('micromessenger');
}

/**
 *
 * @param options
 *
 * @example
 *
 *  oldFunction = rewrite({
 *    fn: oldFunction, // 原始方法
 *    delay: 1000, // 延迟一秒钟执行
 *    before: () => {console.log("oldFunction 之前执行");},
 *    after: () => {console.log("oldFunction 之后执行");}
 *  })
 */

/**
 * 函数重写
 * @return {function(...[*]=)}
 * @param opts
 */
export function rewrite(
	opts = {
		fn: null,
		delay: 0,
		before: null,
		after: null
	}
) {
	if (!opts.fn || typeof opts.fn !== 'function') {
		return () => {};
	}
	return function inner(...args) {
		const dispose = () => {
			if (opts.before && typeof opts.before === 'function') {
				opts.before();
			}
			opts.fn.apply(this, args);
			if (opts.after && typeof opts.after === 'function') {
				opts.before();
			}
		};
		if (opts.delay > 0) {
			setTimeout(dispose, opts.delay);
		} else {
			dispose();
		}
	};
}

/**
 * 检查对象属性是否存在
 * @param v A property name.
 * @return {boolean}
 * @example
 * has.call(this, 'name')
 */
export const has = Object.prototype.hasOwnProperty;

/**
 * 设置 svg 颜色
 * @param id {string} svg id
 * @param color {string|Array} 颜色一一渲染到每个path，如果为字符串则渲染所有path
 * @example
 * 	setSvgColor('icon-add', 'red');
 * 	setSvgColor('icon-add', ['red', 'blue']);
 */
export function setSvgColor(id, color) {
	if (id) {
		const svg = document.getElementById(id);
		if (svg) {
			const { children } = svg;
			let i = 0;
			const len = children.length;

			if (typeof color === 'string') {
				color = Array(len).fill(color);
			}
			if (color.length < len) {
				// eslint-disable-next-line no-console
				console.error(`svg 中元素个数为 ${len}，传入颜色个数不足`);
			} else {
				i = 0;
				for (; i < len; i += 1) {
					const path = children[i];
					const fillColor = color[i];
					path.attributes.fill = fillColor;
					path.style.fill = fillColor;
				}
			}
		}
	}
}
