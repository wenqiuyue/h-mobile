<template>
	<div :class="classRoot">
		<vue-particles
			color="#dedede"
			:particleOpacity="0.7"
			:particlesNumber="80"
			shapeType="circle"
			:particleSize="4"
			linesColor="#dedede"
			:linesWidth="1"
			:lineLinked="true"
			:lineOpacity="0.4"
			:linesDistance="150"
			:moveSpeed="3"
			:hoverEffect="true"
			hoverMode="grab"
			:clickEffect="true"
			clickMode="push"
		/>
		<div :class="`${classRoot}-body`" @click.stop="void 0">
			<van-circle
				v-model="currentRate"
				:rate="rate"
				:clockwise="!reverse"
				:color="gradientColor"
				:text="code"
			/>
			<template v-for="(item, index) in messages">
				<van-divider :key="index">{{ item }}</van-divider>
			</template>
			<div :class="`${classRoot}-footer`">
				<slot v-if="$slots.default" />
				<template v-else>
					<van-button block @click="$router.push({ path: '/home' })">
						回到首页
					</van-button>
					<van-button block @click="$router.back()">返回上一层</van-button>
				</template>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'error-template',
	data() {
		return {
			rate: 0,
			reverse: false,
			interval: null,
			currentRate: 0,
			gradientColor: {
				'0%': '#fddb92',
				'100%': '#d1fdff'
			}
		};
	},
	props: {
		code: { type: String, default: '出错了' },
		messages: { type: Array, default: () => ['发生了一个错误'] }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	},
	created() {
		this.interval = setInterval(this.dispose, 15);
	},
	beforeDestroy() {
		clearInterval(this.interval);
		this.interval = null;
	},
	methods: {
		dispose() {
			if (this.reverse) {
				this.rate -= 1;
			} else {
				this.rate += 1;
			}
			if (this.rate === 100) {
				this.reverse = true;
			} else if (this.rate === 0) {
				this.reverse = false;
			}
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';
@inner-prefix: ~'@{prefix}-error-template';
.@{inner-prefix} {
	height: 100%;
	#particles-js {
		height: 100%;
		overflow: hidden;
	}
	&-body {
		pointer-events: none;
		position: absolute;
		top: 30px;
		width: 100%;
		text-align: center;
	}
	&-footer {
		padding: 20px;
		button {
			pointer-events: auto;
			background-color: rgba(255, 255, 255, 0);
			&:last-child {
				margin-top: 10px;
			}
		}
	}

	.van-divider {
		font-size: 1.2rem;
	}
	.van-circle {
		&__text {
			font-size: 2rem;
			font-weight: bold;
			color: @font-color-middle;
		}
	}
}
</style>
