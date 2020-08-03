<template>
	<div :class="classRoot">
		<van-nav-bar title="模式选择" left-arrow @click-left="$router.back()" />
		<van-grid :column-num="1" icon-size="7.5rem" clickable gutter="1rem">
			<van-grid-item
				text="孕产保健"
				:icon="avatar.mother"
				@click="handleChange('mother')"
			/>
			<van-grid-item
				text="儿童保健"
				:icon="avatar.children"
				@click="handleChange('children')"
			/>
		</van-grid>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import types from '../../../commons/types';

const avatarMother = require('../../../assets/avatar-mother.png');
const avatarChildren = require('../../../assets/avatar-children.png');

export default {
	name: 'mode',
	data() {
		return {
			to: this.$route.query.to,
			mode: this.$route.query.mode,
			back: this.$route.query.back,
			avatar: {
				mother: avatarMother,
				children: avatarChildren
			}
		};
	},
	computed: {
		...mapState({ mode: state => state[types.MODE] }),
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	},
	created() {
		if (this.mode) {
			this.handleChange(this.mode);
		}
	},
	methods: {
		/**
		 * 跳转到
		 * @param mode {string}
		 */
		handleChange(mode) {
			this.$toast.loading('正在切换，请稍后...');
			this.$store.dispatch(types.MODE, mode).then(this.handleSkip);
		},
		/**
		 * 跳转
		 */
		handleSkip() {
			this.$toast.clear();
			this.$router.push({ path: this.mode === 'children' ? '/children' : '/' });
			// if (this.back) {
			// 	this.$router.back();
			// } else {
			// 	this.$router.push({ path: this.to ? this.to : '/home' });
			// }
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';

@inner-prefix: ~'@{prefix}-mode';
.@{inner-prefix} {
	height: 100%;
	background-color: @background-color-container;

	.van-grid {
		margin-top: 1rem;

		&-item {
			&__content {
				padding-top: 2rem;
				padding-bottom: 2rem;
			}

			&__text {
				font-size: 2rem;
			}
		}
	}
}
</style>
