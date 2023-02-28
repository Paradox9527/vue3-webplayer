<!-- icon组件 使用了render，虚拟dom的节点树的形式写的 -->
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
		function getIconCls() { // icon的class
			return `icon-${props.type}`
		}
		function getIconStyle () { // icon大小
			return { fontSize: props.size + 'px' }
		}
		function onClick (e) { // 事件
			content.emit('handleclick', e)
		}
		return {
			getIconCls,
			getIconStyle,
			onClick
		}
	},
	render() { // 渲染函数 渲染节点
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