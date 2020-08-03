<script>
import ErrorTemplate from './components/error-template';

export default {
	name: 'error-404',
	components: { ErrorTemplate },
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		},
		messages() {
			return ['页面未找到', `URL：${this.$route.redirectedFrom}`];
		}
	},
	render(createElement) {
		return createElement('error-template', {
			class: this.classRoot,
			props: { code: '404', messages: this.messages }
		});
	}
};
</script>
<style lang="less">
@import '../../style/variable.less';
@inner-prefix: ~'@{prefix}-error-404';
.@{inner-prefix} {
	font-size: 1rem;
}
</style>
