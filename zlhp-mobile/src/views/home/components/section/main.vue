<script>
import type0 from './components/type0';
import type1 from './components/type1';
import type2 from './components/type2';
import type3 from './components/type3';
import type4 from './components/type4';
import type5 from './components/type5';
import type6 from './components/type6';
import type7 from './components/type7';

export default {
	name: 'home-section',
	components: { type0, type1, type2, type3, type4, type5, type6, type7 },
	props: { data: { type: Object, default: null } },
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	},
	render(createElement) {
		return createElement(`type${this.data.Type}`, {
			class: this.classRoot,
			props: { data: this.data },
			on: { onClick: item => this.$emit('onClick', item) }
		});
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';
@inner-prefix: ~'@{prefix}-home-section';
.@{inner-prefix} {
	margin-bottom: 4px;
}
</style>
