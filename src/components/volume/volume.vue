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
let props = defineProps({
	volume: {
		type:Number,
		requied: true
	}
})
let volumeProgress = computed(() => { return props.volume })
// console.log(volumeProgress.value);
let isMute = computed({
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
})

// method
const getVolumeIconType = function () {
	return isMute.value? 'volume-off' : 'volume'
}
const handleToggleVolume = function () {
	isMute.value = !isMute.value
}
const handleVolumeChange = function (percent) {
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