<!-- icon组件 -->
<script>
import { h } from 'vue';

export default {
	props: {
		type: {
      		type: String,
      		required: true
    	},
    	size: {
      		type: Number,
      		default: 16
    	}
	},
	setup(props, content) {
		// console.log(props.size);
		function getIconCls() {
			return `icon-${props.type}`
		}
		function getIconStyle () {
			return { fontSize: props.size + 'px' }
		}
		function onClick (e) {
			content.emit('click', e)
		}
		// console.log(content);
		return {
			getIconCls,
			getIconStyle,
			onClick
		}
	},
	render() {
		const Icon = h(
			'i',
			{ 
				onClick: this.onClick,
				class: `iconfont ${this.getIconCls()}`,
				style: this.getIconStyle()
			}
		)
		return Icon;
	},
}
</script>

<style lang="scss">
.iconfont {
	display: inline-block;
	font-style: normal;
	font-weight: normal;
	font-variant: normal;
	line-height: 1;
	vertical-align: baseline;
	text-transform: none;
	/* Better Font Rendering =========== */
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
</style>