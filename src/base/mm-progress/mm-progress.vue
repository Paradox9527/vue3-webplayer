<template>
	<div ref="mmProgress" class="mmProgress">
		<div class="mmProgress-bar"></div>
		<div ref="mmPercentProgress" class="mmProgress-outer"></div>
		<div ref="mmProgressInner" class="mmProgress-inner">
			<div class="mmProgress-dot"></div>
		</div>
	</div>
</template>

<script setup>
import { reactive } from "@vue/reactivity";

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

watch(()=> props.percent, (value) => {
	console.log(value)
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