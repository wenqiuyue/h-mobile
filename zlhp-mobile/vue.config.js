const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

/**
 * 目录转换
 * @param dir
 * @returns {string}
 */
function resolve(dir) {
	return path.join(__dirname, dir);
}

module.exports = {
	publicPath: '/',

	css: {
		extract: false,
		sourceMap: false,
		// requireModuleExtension: false, // 取消注释此行后，vant 定制主题不可用
		loaderOptions: {
			less: {
				modifyVars: {
					hack: `true; @import "${resolve('src/style/vant.less')}";`
				}
			}
		}
	},

	// 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
	// 是否生成生产环境中的 *.map 文件
	productionSourceMap: false,

	devServer: {
		// 新版的webpack-dev-server增加了安全验证，默认检查hostname，如果hostname不是配置内的，将中断访问。
		// 所以添加此配置
		disableHostCheck: true,

		host: '127.0.0.1',
		port: 80,
		https: false,
		hotOnly: true, // 热更新

		proxy: {
			// 普通接口
			'/v1': {
				target: `${process.env.DOMAIN}:20716`,
				ws: false,
				changeOrigin: true
			},
			// 对外接口
			'/api': {
				target: `${process.env.DOMAIN}:20716`,
				ws: false,
				changeOrigin: true
			},
			// 微信接收消息
			'/wx': {
				target: `${process.env.DOMAIN}:20716`,
				ws: false,
				changeOrigin: true
			},
			// 上传接口
			'/upload': {
				target: `${process.env.DOMAIN}:20718`,
				ws: false,
				changeOrigin: true
			},
			// 文件资源接口
			'/res': {
				target: `${process.env.DOMAIN}:20718`,
				ws: false,
				changeOrigin: true
			}
		}
	},

	chainWebpack: config => {
		// 修复HMR
		config.resolve.symlinks(true);

		// config.entry('main').add('babel-polyfill');

		// config.module
		// 	.rule('images')
		// 	.test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
		// 	.use('image-webpack-loader')
		// 	.loader('image-webpack-loader')
		// 	.options({ bypassOnDebug: true });
		//
		// config.plugin('compressionPlugin').use(
		// 	new CompressionPlugin({
		// 		test: /\.js$|\.html$|.\css/, // 匹配文件名
		// 		threshold: 10240, // 对超过10k的数据压缩
		// 		deleteOriginalAssets: false // 不删除源文件
		// 	})
		// );
	},
	// transpileDependencies: [
	// 	'vant',
	// 	'lodash',
	// 	'nzh',
	// 	'@antv/f2',
	// 	'@aspnet/signalr',
	// 	'axios',
	// 	'js-cookie',
	// 	'jsbarcode',
	// 	'qrcodejs2',
	// 	'vee-validate',
	// 	'velocity-animate',
	// 	'vue-particles',
	// 	'vue-pdf',
	// 	'weixin-js-sdk'
	// ],

	// configureWebpack: config => {
	// 	// 浏览器兼容性配置
	// 	config.entry.app = ['babel-polyfill', './src/main.js'];
	// 	// // 外部模块
	// 	// config.externals = {};
	// 	// // 插件配置
	// 	// config.plugins = [
	// 	// 	new CompressionPlugin({
	// 	// 		test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
	// 	// 		threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
	// 	// 		deleteOriginalAssets: false // 是否删除原文件
	// 	// 	})
	// 	// ];
	// },
	configureWebpack: {
		// resolve: {
		// 	// 别名设置
		// 	alias: {
		// 		'@': resolve('src'),
		// 		assets: resolve('src/assets'),
		// 		components: resolve('src/components')
		// 	}
		// },
		// 外部模块
		externals: {
			// vue: 'Vue',
			// vuex: 'Vuex',
			// 'vue-router': 'VueRouter',
			// 'weixin-js-sdk': 'wx',
			// 'js-cookie': 'Cookies',
			// vant: 'vant',
			// F2: 'F2',
			// lodash: '_',
			// 'vee-validate': 'VeeValidate',
			// qrcodejs2: 'QRCode',
			// jsbarcode: 'JsBarcode',
			// 'velocity-animate': 'Velocity'
		},
		plugins: [
			new CompressionPlugin({
				test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
				threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
				deleteOriginalAssets: false // 是否删除原文件
			})
		]
	}
};
