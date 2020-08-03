<template>
	<div
		:id="classRoot"
		:class="{ [`${classRoot}-children`]: mode === 'children' }"
	>
		<vue-particles
			v-if="settings_particles.enabled"
			color="#dedede"
			shapeType="circle"
			linesColor="#dedede"
			hoverMode="grab"
			clickMode="push"
			:class="{ top: settings_particles.top }"
			:particleOpacity="0.7"
			:particlesNumber="80"
			:particleSize="4"
			:linesWidth="1"
			:lineLinked="true"
			:lineOpacity="0.4"
			:linesDistance="150"
			:moveSpeed="3"
			:hoverEffect="true"
			:clickEffect="true"
		/>
		<transition name="van-fade">
			<router-view />
		</transition>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { Config } from './commons/weixin';
import { setDocumentTitle } from './commons';
import types from './commons/types';
import * as SiteApi from './apis/SiteApi';

export default {
	name: 'app',
	data() {
		return {
			wxConfigTryCount: 0 // 微信Config配置尝试次数
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		},
		...mapState({
			mode: state => state[types.MODE],
			token: state => state[types.TOKEN],
			settings_particles: state => state[types.SETTINGS_PARTICLES]
		})
	},
	watch: {
		token() {
			this.loadData();
		}
	},
	created() {
		// 初始化微信配置
		this.WeiXinConfigInit();
		if (this.token) {
			this.loadData();
		}
	},
	methods: {
		/**
		 * 加载数据
		 */
		loadData() {
			// 加载站点名
			SiteApi.GetCurrentName().then(response => {
				if (response.Code === 0) {
					setDocumentTitle(response.Body);
				}
			});
		},
		/**
		 * 微信配置初始化
		 */
		WeiXinConfigInit() {
			if (this.wxConfigTryCount < 3) {
				this.wxConfigTryCount += 1;
				Config().catch(this.WeiXinConfigInit);
			} else {
				// eslint-disable-next-line no-console
				console.error('获取微信JS SDK失败！');
			}
		}
	}
};
</script>

<style lang="less">
@import './style/index.less';
@import './style/variable.less';

@inner-prefix: ~'@{prefix}-app';

html,
body,
#@{inner-prefix} {
	height: 100%;
	width: 100%;
	color: @font-color;

	#particles-js {
		height: 100%;
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;

		&.top {
			z-index: 99999;
			pointer-events: none;
		}
	}
}

// 儿童模式
.@{inner-prefix}-children {
	.van-nav-bar {
		background-color: @van-nav-bar-background-children;
	}
}
</style>
