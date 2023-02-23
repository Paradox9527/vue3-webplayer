<template>
	<div ref="mmProgress" class="mmProgress" @click="barClick">
		<div class="mmProgress-bar"></div>
		<div ref="mmPercentProgress" class="mmProgress-outer"></div>
		<div ref="mmProgressInner" class="mmProgress-inner">
			<div class="mmProgress-dot" @mousedown="barDown" @touchstart.prevent="barDown"></div>
		</div>
	</div>
</template>

<script setup>
import { reactive } from "@vue/reactivity";
import { getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const emit = defineEmits(['percentChangeEnd', 'percentChange'])
const dotWidth = 10;
const props = defineProps({
	// 进度值一
	percent: {
		type: [Number],
		default: 0
	},
	// 进度值二
	percentProgress: {
		type: [Number],
		default: 0
	}
})
const data = reactive({
	move: {
		status: false, // 是否可拖动
		startX: 0, // 记录最开始点击的X坐标
		left: 0
	}
})

// watch监听props
watch(()=> props.percentProgress, (newvalue) => { // 缓冲进度
	let offsetWidth = proxy.$refs.mmProgress.clientWidth * newvalue;
	proxy.$refs.mmPercentProgress.style.width = `${offsetWidth}px`

})
watch(() => props.percent, (newvalue) => { // 监听播放进度
	if (newvalue >= 0 && !data.move.status) {
		const barWidth = proxy.$refs.mmProgress.clientWidth - dotWidth;
		const offsetWidth = newvalue * barWidth;
		moveSilde(offsetWidth)
	}
})

// methods
const bindEvents = function () { // 添加绑定事件
	document.addEventListener('mousemove', barMove)
    document.addEventListener('mouseup', barUp)

    document.addEventListener('touchmove', barMove)
    document.addEventListener('touchend', barUp)
}
const unbindEvents = function (){ // 移除绑定事件
	document.removeEventListener('mousemove', barMove)
    document.removeEventListener('mouseup', barUp)

    document.removeEventListener('touchmove', barMove)
    document.removeEventListener('touchend', barUp)
}
const barClick = function (e) { // 点击事件
	let rect = proxy.$refs.mmProgress.getBoundingClientRect();
	console.log(rect);
	let offsetWidth = Math.min(
		proxy.$refs.mmProgress.clientWidth - dotWidth,
		Math.max(0, e.clientX - rect.left)
	)
	moveSilde(offsetWidth)
	commitPercent(true);
}
const barDown = function (e) { // 鼠标按下事件
	data.move.status = true;
	data.move.startX = e.clientX || e.touches[0].pageX
	data.move.left = proxy.$refs.mmProgressInner.clientWidth
}
const moveSilde = function (offsetWidth) { // 移动滑块
	proxy.$refs.mmProgressInner.style.width = `${offsetWidth}px`
}
const commitPercent = function (isEnd = false) { // 修改percent
	const { mmProgress, mmProgressInner } = proxy.$refs
	const lineWidth = mmProgress.clientWidth - dotWidth
    const percent = mmProgressInner.clientWidth / lineWidth
	emit(isEnd ? 'percentChangeEnd' : 'percentChange', percent);
}
const barMove = function (e) { // 鼠标/触摸移动事件
	if (!data.move.status) {
		return false;
	}
	e.preventDefault()
	let endX = e.clientX || e.touches[0].pageX;
	let dist = endX - data.move.startX
	let offsetWidth = Math.min(
        proxy.$refs.mmProgress.clientWidth - dotWidth,
        Math.max(0, data.move.left + dist)
    )
	moveSilde(offsetWidth)
	commitPercent()
}
const barUp = function (e) { // 鼠标/触摸释放事件
	if (data.move.status) {
		commitPercent(true);
		data.move.status = false;
	}
}
onMounted(() => { // 挂载
	nextTick(() => {
		bindEvents(); // 绑定事件
		const barWidth = proxy.$refs.mmProgress.clientWidth - dotWidth;
		const offsetWidth = props.percent * barWidth;
		moveSilde(offsetWidth)
	})
})

onBeforeUnmount(() => {
	unbindEvents(); // 解除绑定事件
})
</script>

<style lang="scss">
.mmProgress {
	position: relative;
	padding: 5px;
	user-select: none;
	cursor: pointer;
	overflow: hidden;
	.mmProgress-bar {
		height: 2px;
		width: 100%;
		background: $bar_color;
	}
	.mmProgress-outer {
		position: absolute;
		top: 50%;
		left: 5px;
		display: inline-block;
		width: 0;
		height: 2px;
		margin-top: -1px;
		background: rgba(255, 255, 255, 0.2);
	}
	.mmProgress-inner {
    	position: absolute;
    	top: 50%;
    	left: 5px;
    	display: inline-block;
    	width: 0;
    	height: 2px;
    	margin-top: -1px;
    	background: $line_color;
    .mmProgress-dot {
      	position: absolute;
      	top: 50%;
      	right: -5px;
      	width: 10px;
      	height: 10px;
      	border-radius: 50%;
      	background-color: $dot_color;
      	transform: translateY(-50%);
    }
  }
}
</style>