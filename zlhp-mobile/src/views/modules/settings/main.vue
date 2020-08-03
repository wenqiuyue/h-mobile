<template>
	<div :class="classRoot">
		<van-nav-bar title="设置" left-arrow @click-left="$router.back()" />
		<van-pull-refresh
			:class="`${classRoot}-body`"
			v-model="isLoading"
			@refresh="onRefresh"
		>
			<van-cell-group title="功能">
				<van-cell title="切换模式" to="/mode" is-link />
			</van-cell-group>
			<van-cell-group title="动态背景">
				<van-switch-cell
					v-model="settings_particles.enabled"
					active-color="#FFC6CB"
					title="启用"
				/>
				<van-switch-cell
					v-model="settings_particles.top"
					active-color="#FFC6CB"
					title="置顶"
					:disabled="!settings_particles.enabled"
				/>
			</van-cell-group>
		</van-pull-refresh>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import types from '../../../commons/types';

export default {
	name: 'settings',
	data() {
		return {
			isLoading: false
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		},
		...mapState({
			settings_particles: state => state[types.SETTINGS_PARTICLES]
		})
	},
	watch: {
		settings_particles: {
			deep: true,
			handler(val) {
				if (!val.enabled) {
					val.top = false;
				}
				this.$store.dispatch(types.SETTINGS_PARTICLES, val);
			}
		}
	},
	methods: {
		/**
		 * 刷新
		 */
		onRefresh() {
			this.isLoading = true;
			setTimeout(() => {
				this.isLoading = false;
			}, 100);
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';
@inner-prefix: ~'@{prefix}-settings';
.@{inner-prefix} {
	height: 100%;
	.van-pull-refresh {
		height: calc(100% - 46px);
		overflow: scroll;
		&__track {
			min-height: 100%;
		}
	}
}
</style>
