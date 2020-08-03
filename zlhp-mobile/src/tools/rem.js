/**
 * 设置 rem 函数
 */
function setRem() {
	// 设计稿大小
	const designDraftSize = 375;
	// 基础字体大小
	const baseRem = designDraftSize / process.env.VUE_APP_FONT_SIZE;

	// HTML 页面宽度
	const htmlWidth =
		document.documentElement.clientWidth || document.body.clientWidth;
	// HTML DOM 元素
	const htmlDom = document.getElementsByTagName('html')[0];
	// 计算出根元素字体大小
	const rootSize = htmlWidth / baseRem;
	// 设置根元素字体大小
	htmlDom.style.fontSize = `${rootSize}px`;
}

// 改变窗口大小时重新设置 rem
window.onresize = () => {
	setRem();
};

// 初始化
setRem();
