<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-body`">
			<router-view />
		</div>
		<van-tabbar route>
			<template v-for="item in tabbar[mode]">
				<van-tabbar-item :key="item['name']" :to="item['to']">
					<svg-icon
						replace
						slot="icon"
						slot-scope="props"
						:size="1.5"
						:value="
							props.active ? item['icon']['active'] : item['icon']['inactive']
						"
					/>
					{{ item['title'] }}
				</van-tabbar-item>
			</template>
		</van-tabbar>
	</div>
</template>
<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import types from '../commons/types';
import tabbar from './tabbar';

export default {
	name: 'main-container',
	data() {
		return {
			tabbar: _.cloneDeep(tabbar)
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		},
		...mapState({
			mode: state => state[types.MODE]
		})
	}
};
</script>
<style lang="less">
@import '../style/variable.less';
@inner-prefix: ~'@{prefix}-main-container';
.@{inner-prefix} {
	background-color: @background-color-container;
	height: 100%;

	&-body {
		height: calc(100% - 50px);
		overflow-x: hidden;
		overflow-y: auto;
	}

	.van-tabbar {
		&-item {
			&__icon {
				margin-bottom: 0.1rem;
			}
			&__text {
				color: @font-color;
				font-size: 1rem;
			}
		}
	}
}
</style>
