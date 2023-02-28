<!-- 音量控制组件 -->
<template>
	<div class="volume">
		<mm-icon
			class="pointer volume-icon"
			:type="getVolumeIconType()"
			:size="30"
			@handleclick="handleToggleVolume"
		></mm-icon>
		<div class="volume-progress-wrapper">
			<mm-progress
				:percent="volumeProgress"
        		@percentChangeEnd="handleVolumeChange"
        		@percentChange="handleVolumeChange"
			></mm-progress>
		</div>
	</div>
</template>

<script setup>
import MmProgress from '@/base/mm-progress/mm-progress.vue'

const emit = defineEmits(['volumeChange'])
const lastVolume = ref(1);

// 自定义属性props
let props = defineProps({
	volume: {
		type:Number,
		requied: true
	}
})

// 计算属性
let volumeProgress = computed(() => { return props.volume }); // 音量大小
let isMute = computed({ // 是否静音
	// getter
	get() {
		return volumeProgress.value === 0
	},
	// setter
	set(newMute) {
		const volume = newMute? 0 : lastVolume.value
		if (newMute) {
			lastVolume.value = volumeProgress.value;
		}
		handleVolumeChange(volume)
	}
});

// method
const getVolumeIconType = function () { // 返回静音icon是静音的还是不是静音的
	return isMute.value? 'volume-off' : 'volume'
}
const handleToggleVolume = function () { // 静音切换
	isMute.value = !isMute.value
}
const handleVolumeChange = function (percent) { // 音量调节传输父组件变化的百分比，从而调节音量
	emit('volumeChange', percent)
}
</script>

<style lang="scss">
.volume {
	display: flex;
	align-items: center;
	width: 150px;
	&-icon {
		margin-right: 5px;
		color: #fff;
	}
	&-progress-wrapper {
		flex: 1;
	}
	@media (max-width: 768px) {
		top: 2px;
		width: 36px;
	}
}
</style>