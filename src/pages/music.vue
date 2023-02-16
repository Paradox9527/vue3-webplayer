<template>
	<div class="music">
		<div class="music-content">
			<!-- 左侧 -->
			<div class="music-left">
				<music-btn></music-btn>
				<router-view class="music-list"></router-view>
			</div>
			<!-- 右侧 -->
			<div class="music-right"></div>
		</div>

		<!-- 播放器 -->
		<div class="music-bar" :class="{disable: !musicReady || !currentMusic.id }">
			<div class="music-bar-btns">
				<mmIcon
					class="pointer"
					type="prev"
					:size="36"
					title="上一曲 Ctrl + Left"
					@handleclick="prev"
				/>
				<div class="control-play pointer" title="播放暂停 Ctrl + Space">
					<mm-icon :type="playing ? 'pause': 'play'" :size="24" @handleclick="play"/>
				</div>
				<mmIcon
					class="pointer"
					type="next"
					:size="36"
					title="下一曲 Ctrl + Right"
					@handleclick="next"
				/>
			</div>

			<div class="music-music">
				<div class="music-bar-info">
					<template v-if="currentMusic && currentMusic.id">
						{{ currentMusic.name }}
						<span>- {{ currentMusic.singer }}</span>
					</template>
					<template v-else>
						欢迎使用vue3-player在线音乐播放器
					</template>
				</div>
				<!-- 时间 -->
				<div class="music-bar-time" v-if="currentMusic.id">
					{{ format(currentTime) }}/{{ format(currentMusic.duration % 3600) }} 
				</div>
				<!-- 进度条 -->

			</div>
			<!-- 播放模式 -->
			<mmIcon
				class="icon-color pointer mode"
				:type="getModeIconType()"
				:size="30"
				:title="getModeIconTitle()"
			/>

			<!-- 评论 -->
			<mmIcon
				class="icon-color pointer comment"
				type="comment"
				:size="30"
				title="循环播放"
			/>

			<!-- 音量控制 -->
			<div class="music-bar-volume">

			</div>
		</div>

		<!-- 遮罩 -->
		<div class="mmPlayer-bg"></div>
		<div class="mmPlayer-mask"></div>
	</div>
</template>

<script setup>
import MusicBtn from '@/components/music-btn/music-btn.vue';
import { useMusicStore } from '@/store/modules/musicList.js'
import { silencePromise } from '@/utils/util.js'
import { computed, getCurrentInstance, ref, watch } from 'vue';
import { format } from '@/utils/util';
import { playMode } from '@/config';
const { proxy } = getCurrentInstance();

let musicReady = ref(false); // 是否可以使用播放器
let currentTime = ref(0); // 当前播放时间
const musicStore = useMusicStore()
// 计算属性
const audioEle = computed(() => { return musicStore.getaudioEle; })
const mode = computed(() => { return musicStore.getPlayMode; })
const playing = computed(() => { return musicStore.getPlayingStatus; })
const playlist = computed(() => { return musicStore.getPlayList; })
const currentMusic = computed(() => { return musicStore.getCurrentMusic; })
const currentIndex = computed(() => { return musicStore.getCurrentIndex; })
const percentMusic = computed(() => {
	const duration = currentMusic.value.duration;
	return currentTime.value && duration ? currentTime / duration : 0
})

watch(currentIndex, (value) => { // 只有发生变化才会调用
	// console.log(value);
	// console.log(musicReady.value);
	// console.log(currentMusic.value.id);
})

watch(playing, (value) => {
	const audio = audioEle;
	nextTick(() => {
		value? silencePromise(audio.value.play()) : audio.value.pause()
		musicReady.value = true;
	})
})

watch(currentMusic, (value) => { // 播放
	audioEle.value.src = value.url;
	currentTime.value = 0;// 重置参数
	silencePromise(audioEle.value.play())
})

watch(currentTime, (value) => {
	
})

// 上一曲
const prev = function() {
	if (!musicReady.value) {
		return
	}
	if (playlist.value.length === 1) {
		loop();// 循环播放
	} else {
		let index = currentIndex.value - 1;
		console.log(index);
		if (index < 0) {
			index = playlist.value.length - 1;
		}
		musicStore.setCurrentIndex(index);
		if (!playing.value && this.musicReady) {
          this.setPlaying(true)
        }
		musicReady.value = true;
	}
}
// 播放暂停
const play = function() {
	if(!musicReady.value) {
		return
	}
	musicStore.setPlaying(!playing.value);
}
// 下一首
// 当 flag 为 true 时，表示上一曲播放失败
const next = function (flag = false) {
	if(!musicReady.value) {
		return
	}
	const length = playlist.value.length
	if((length - 1 === currentIndex.value && mode.value === playMode.order) || (length === 1 && flag)) {
		musicStore.setCurrentIndex(-1);
		musicStore.setPlaying(false);
		return
	}
	if (length === 1) {
		loop();// 循环播放
	} else {
		let index = currentIndex.value + 1;
		if (index === length) {
			index = 0; // 从头播放
		}
		console.log(playing.value);
		if (!playing.value && musicReady.value) {
			musicStore.setPlaying(true);
		}
		musicStore.setCurrentIndex(index);
		musicReady.value = true
	}
}

// 循环
const loop = function() {
	audioEle.value.currentTime = 0;
	silencePromise(audioEle.value.play())
	musicStore.setPlaying(true);
}
const getModeIconType =  function () {
	return {
		[playMode.listLoop]: 'loop',
        [playMode.order]: 'sequence',
        [playMode.random]: 'random',
        [playMode.loop]: 'loop-one'
	}[mode.value]
}
const getModeIconTitle = function () {
	const key = 'Ctrl + O'
    return {
        [playMode.listLoop]: `列表循环 ${key}`,
        [playMode.order]: `顺序播放 ${key}`,
        [playMode.random]: `随机播放 ${key}`,
        [playMode.loop]: `单曲循环 ${key}`
    }[mode.value]
}
// 获取播放模式 icon

</script>

<style lang="scss">
.music {
	padding: 75px 25px 25px 25px;
	width: 100%;
	max-width: 1750px;
	margin: 0 auto;
	height: 100%;
	box-sizing: border-box;
	overflow: hidden;
	.music-content {
		display: flex;
		width: 100%;
		height: calc(100% - 80px);
		.music-left {
			flex: 1;
			height: 100%;
			overflow: hidden;
			.music-list {
				height: calc(100% - 60px);
			}
		}
		.music-right {
			position: relative;
			width: 310px;
			margin-left: 10px;

		}
	}

	// 底部
	.music-bar {
		display: flex;
		align-items: center;
		width: 100%;
		height: 80px;
		box-sizing: border-box;
		padding-bottom: 15px;
		color: #fff;
		&.disable {
			pointer-events: none;
			opacity: 0.6;
		}
		.icon-color {
			color: #fff;
		}
		.music-bar-btns {
    		display: flex;
			justify-content: space-between;
			align-items: center;
			width: 180px;
      		.control-play {
        		@include flex-center;
				border-radius: 50%;
        		width: 40px;
        		height: 40px;
        		color: #fff;
        		background-color: rgba(255, 255, 255, 0.3);
        		.icon-bofang101 {
          			transform: translateX(2px);
        		}
      		}
    	}
		@include flex-center;
		.btn-prev{
			width: 19px;
			min-width: 19px;
			height: 20px;
			background-position: 0 -30px;
		}
		.btn-play {
			width: 21px;
			min-width: 21px;
			height: 29px;
			margin: 0 50px;
			background-position: 0 0;
			&.btn-play-pause {
        		background-position: -30px 0;
      		}
    	}
		.btn-next {
			width: 19px;
			min-width: 19px;
			height: 20px;
			background-position: 0 -52px;
    	}
		.music-music {
			position: relative;
			width: 100%;
			flex: 1;
			box-sizing: border-box;
			padding-left: 40px;
			font-size: $font_size_small;
			color: $text_color_active;
			.music-bar-info {
				height: 15px;
				padding-right: 80px;
				line-height: 15px;
				text-overflow: ellipsis;
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 1;
        		-webkit-box-orient: vertical;
			}
			.music-bar-time {
				position: absolute;
				top: 0;
				right: 5px;
			}
		}
		.mode,
    	.comment,
    	.music-bar-volume {
			margin-left: 20px;
    	}

    	// 音量控制
    	.volume-wrapper {
			margin-left: 20px;
			width: 150px;
    	}
	}
	// 遮罩
	.mmPlayer-bg,
	.mmPlayer-mask{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.mmPlayer-mask {
		z-index: -1;
	    background-color: $mask_color;
	}

	.mmPlayer-bg {
		z-index: -2;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: 50%;
		filter: blur(3px);
		opacity: 0.7;
		transition: all 0.8s;
		transform: scale(1.1);
		background-image: url('@/assets/images/Sword Art Online - Ordinal Scale12.5.png');
	}

	// 移动端适配
	@media (min-width: 960px) {
		// 关闭歌词
		.close-lyric {
			display: none;
		}
	}

	// 当屏幕小于960时
	@media (max-width: 960px) {
		.music-right {
			display: none;
			&.show {
				display: block;
				margin-left: 0;
				width: 100%;
			}
		}
	}

	// 当屏幕小于768时
	@media (max-width: 768px) {
		& {
    		padding: 75px 15px 5px 15px;
		}

		.music-content .music-left {
      		.music-list {
        		font-size: $font_size_medium;
      		}
    	}	

    	.music-bar {
      		.music-bar-info span,
      		.music-bar-volume .mmProgress {
        		display: none;
      		}
    	}
	}

	//当屏幕小于520时
	@media (max-width: 520px) {
    	.music-bar {
			position: relative;
			flex-direction: column;
			.music-bar-btns {
				width: 60%;
				margin-top: 15px;
				order: 2;
			}
    	  	.music-music {
    	    	padding-left: 0;
    	    	order: 1;
    	  	}
    	  	& > i.mode {
    	    	position: absolute;
    	    	top: 40px;
    	    	left: 5px;
    	    	margin: 0;
    	  	}
    	  	.comment {
    	    	position: absolute;
    	    	top: 40px;
    	    	right: 5px;
    	  	}
    	  	.music-bar-volume {
    	    	display: none;
    	  	}
    	}
	}

}

</style>