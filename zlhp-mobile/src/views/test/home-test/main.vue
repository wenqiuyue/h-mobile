<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-background`">
			<div class="title">
				<div @click="$emit('onChangeSite')">
					<svg-icon value="icon-home_Hospital" :size="1.5" />
					玉山县妇幼保健院
					<svg-icon value="icon-home_BlackSwitching" :size="0.75" />
				</div>
				<div @click="$emit('onQRCode')">
					<svg-icon value="icon-home_QRcode" />
					我的二维码
				</div>
			</div>
		</div>
		<div :class="`${classRoot}-body`">
			<CustomHeader
				:userName="'钟柳柳'"
				:avatar="'https://img.yzcdn.cn/vant/cat.jpeg'"
				:userInfo="'您已怀孕131天，18周6天 距离预产期还有129天'"
				:countDownTitle="'产检'"
				:countDown="30 * 60 * 60 * 1000"
				:avatarIcon="'icon-home_HeadDecoration'"
			></CustomHeader>
			<div class="top_select_panel">
				<Type5
					:title="'自主建档'"
					:src="`${require('../../../assets/Independentfiling.png')}`"
				></Type5>
				<Message
					:message="'新消息新消息，图文问诊有新消图文问诊有新消'"
				></Message>
				<div class="manual">
					<van-image :src="require('../../../assets/manual.png')" />
				</div>
			</div>
			<Type6></Type6>
		</div>
	</div>
</template>
<script>
import CustomHeader from './compoments/header-wite';
import Type5 from './compoments/type5';
import Type6 from './compoments/type6';
import Message from './compoments/message';

export default {
	name: 'home-test',
	components: { CustomHeader, Type5, Type6, Message },
	data() {
		return {};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable';

@inner-prefix: ~'@{prefix-mother}-home-test';
.@{inner-prefix} {
	background: #f9f9f9;
	&-background {
		background: linear-gradient(
			180deg,
			rgba(255, 221, 223, 1) 0%,
			rgba(255, 220, 222, 1) 51%,
			rgba(255, 220, 222, 0) 100%
		);
		height: 186px;
		.title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 11px 15px;
			div:first-child {
				font-size: 14px;
				color: #333333;
			}
			div:last-child {
				font-size: 13px;
				color: #333333;
			}
		}
	}
	&-body {
		padding: 0 10px 20px 10px;
		.top_select_panel {
			margin-top: 105px;
			background: #ffffff;
			border-radius: 0 0 10px 10px;

			.manual {
				margin-top: 25px;
				text-align: center;
				.van-image {
					width: 330px;
					height: 110px;
				}
			}
		}
	}
}
</style>
