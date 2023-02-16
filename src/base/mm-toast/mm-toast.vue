<template>
	<!-- 弹出层 -->
	<transition name="toast-fade">
		<div v-show="data.visible" class="mm-toast" :class="positionClasss">
			{{ data.message }}
		</div>
	</transition>
</template>

<script setup>
// const position = ref('center');
// const message = ref('');
// const duration = ref(1500);
// const visible = ref(false);
const data = reactive({
	position: 'center',
	message: '',
	duration: 1500,
	visible: false
})
const positionClasss = computed(() => {
	return 'mm-toast-' + data.position;
})

defineExpose({
	data
})
</script>

<style lang="scss">
$prefix-cls: mm-toast;

.#{$prefix-cls} {
	position: fixed;
  	left: 50%;
  	z-index: 1997;
  	max-width: 80%;
  	box-sizing: border-box;
  	border-radius: 5px;
  	padding: 10px 20px;
  	overflow: hidden;
  	text-align: center;
  	min-height: 40px;
  	line-height: 20px;
  	font-size: 14px;
  	color: #fff;
  	background: rgba(0, 0, 0, 0.5);
  	user-select: none;
  	transform: translateX(-50%);
	&-top {
		top: 10%;
	}
	&-center {
		top: 50%;
		// transform: translateY(-50%);
		margin-top: -2%;
	}
	&-bottom {
		bottom: 10%;
	}
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translate3d(-50%, -10px, 0);
}

.toast-fade-enter-active {
  will-change: transform;
  transition: all 0.2s;
}

.toast-fade-enter-to {
  opacity: 1;
  transform: translate3d(-50%, 0, 0);
}
</style>