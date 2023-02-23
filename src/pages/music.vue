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
				<mm-progress
					class="music-progress"
					:percent="percentMusic"
					:percent-progress="currentProgress"
					@percentChange="progressMusic"
					@percentChangeEnd="progressMusicEnd"
				>
				</mm-progress>
			</div>
			<!-- 播放模式 -->
			<mmIcon
				class="icon-color pointer mode"
				:type="getModeIconType()"
				:size="30"
				:title="getModeIconTitle()"
				@handleclick="modeChange"
			/>

			<!-- 评论 -->
			<mmIcon
				class="icon-color pointer comment"
				type="comment"
				:size="30"
				title="循环播放"
				@handleclick="openComment"
			/>

			<!-- 音量控制 -->
			<div class="music-bar-volume" title="音量加减 [Ctrl + Up / Down]">

			</div>
		</div>

		<!-- 遮罩 -->
		<div class="mmPlayer-bg"></div>
		<div class="mmPlayer-mask"></div>
	</div>
</template>

<script setup>
import MusicBtn from '@/components/music-btn/music-btn.vue';
import MmProgress from '@/base/mm-progress/mm-progress.vue';
import { useMusicStore } from '@/store/modules/musicList.js'
import { silencePromise } from '@/utils/util.js'
import { computed, getCurrentInstance, ref, watch } from 'vue';
import { format, randomSortArray } from '@/utils/util';
import { playMode } from '@/config';
const { proxy } = getCurrentInstance();

let musicReady = ref(false); // 是否可以使用播放器
let currentTime = ref(0); // 当前播放时间
let currentProgress = ref(0); // 当前缓冲进度
const musicStore = useMusicStore()
// 计算属性
const audioEle = computed(() => { return musicStore.getaudioEle; })
const mode = computed(() => { return musicStore.getPlayMode; })
const playing = computed(() => { return musicStore.getPlayingStatus; })
const playlist = computed(() => { return musicStore.getPlayList; })
const currentMusic = computed(() => { return musicStore.getCurrentMusic; })
const currentIndex = computed(() => { return musicStore.getCurrentIndex; })
const orderList = computed(() => { return musicStore.getOrderList })
const percentMusic = computed(() => {
	const duration = currentMusic.value.duration;
	return currentTime.value && duration ? currentTime.value / duration : 0
})
const historyList = computed(() => { return musicStore.getHistoryList; })

watch(percentMusic, (value) => {
})
watch(currentIndex, (value) => { // 只有发生变化才会调用
})

watch(playing, (value) => {
	const audio = audioEle;
	nextTick(() => {
		value? silencePromise(audio.value.play()) : audio.value.pause()
		musicReady.value = true;
	})
})

watch(currentMusic, (value) => { // 监听当前音乐的信息
	audioEle.value.src = value.url;
	currentTime.value = 0;// 重置参数
	silencePromise(audioEle.value.play())
})

watch(currentTime, (newValue) => { // 监听当前播放时间

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
		musicReady.value = false;
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
		musicReady.value = false
	}
}

// 循环
const loop = function() {
	audioEle.value.currentTime = 0;
	silencePromise(audioEle.value.play())
	musicStore.setPlaying(true);
}
// 获取播放模式 icon
const getModeIconType =  function () {
	return {
		[playMode.listLoop]: 'loop',
        [playMode.order]: 'sequence',
        [playMode.random]: 'random',
        [playMode.loop]: 'loop-one'
	}[mode.value]
}
// 获取播放模式 title
const getModeIconTitle = function () {
	const key = 'Ctrl + O'
    return {
        [playMode.listLoop]: `列表循环 ${key}`,
        [playMode.order]: `顺序播放 ${key}`,
        [playMode.random]: `随机播放 ${key}`,
        [playMode.loop]: `单曲循环 ${key}`
    }[mode.value]
}
// 修改当前歌曲索引
const resetCurrentIndex = function(list) {
	const index = list.findIndex((item) => {
		return item.id = currentMusic.value.id
	})
	musicStore.setCurrentIndex(index);
}
// 切换播放模式
const modeChange = function () {
	const changeMode = (mode.value + 1) % 4
	musicStore.setPlayMode(changeMode);
	if (changeMode === playMode.loop) { // 默认为循环
		return
	}
	let list = [];
	switch (changeMode) {
		case playMode.listLoop:
		case playMode.order:
			list = orderList.value
			break
		case playMode.random:
			list = randomSortArray(orderList.value)
			break
	}
	resetCurrentIndex(list);
	musicStore.setPlayList(list);
	proxy.$mmToast("播放模式切换功能好像还有bug")
}
// 打开音乐评论
const openComment = function () {
	if (!currentMusic.value.id) {
		proxy.$mmToast('还没有播放歌曲哦！');
		return false
	}
	proxy.$mmToast('功能还在重构中~');
}
// 修改音乐显示时长
const progressMusic = function (percent) {
	currentTime.value = currentMusic.value.duration * percent;
}
// 修改音乐进度
const progressMusicEnd = function (percent) {
	audioEle.value.currentTime = currentMusic.value.duration * percent;
}
// 初始化播放器，播放器行为追加
const initAudio = function () {
	let retry = 1 // 重试次数
	const ele = audioEle.value;
	// 音频缓冲事件
	ele.onprogress = () => {
		try {
			if (ele.buffered.length > 0) {
				const duration = currentMusic.value.duration;
				let buffered = 0;
				ele.buffered.end(0);
				buffered = ele.buffered.end(0) > duration ? duration : ele.buffered.end(0);
				currentProgress.value = buffered / duration;
			}
		} catch (error) {
		}
	}
	// 开始播放音乐
	ele.onplay = () => {
		let timer
		clearTimeout(timer);
		timer = setTimeout(() => {
			musicReady.value = true;
		}, 100)
	}
	// 获取当前播放时间
	ele.ontimeupdate = () => { // 通关监听器，就能改变时间了
		currentTime.value = ele.currentTime
	}
	// 当前音乐播放完毕
	ele.onended = () => {
		if (mode.value === playMode.loop) {
			loop()
		} else {
			next()
		}
	}
	// 音乐播放出错
	ele.onerror = () => {
		if (retry === 0) {
			let toastText = '当前音乐不可播放，已自动播放下一曲'
			if (playlist.value.length === 1) {
				toastText = '没有可播放的音乐哦~'
			}
			proxy.$mmToast(toastText)
			next(true)
		} else {
			console.log("重试一次");
			retry -= 1;
			ele.url = currentMusic.value.url;
			ele.load()
		}
	}
	// 音乐进度拖动大于加载时重载音乐
	ele.onstalled = () => {
		ele.load()
		musicStore.setPlaying(false)
		let timer
		clearTimeout(timer)
		timer = setTimeout(() => {
			musicStore.setPlaying(true)
		}, 10)
	}
	// 将能播放的音乐加入播放历史
	ele.oncanplay = () => {
		retry = 1;
		if (historyList.value.length === 0 || currentMusic.value.id !== historyList.value[0].id) {
			musicStore.setHistoryList(currentMusic.value);
		}
	}
	// 音频已暂停
	ele.onpause = () => {
		musicStore.setPlaying(false)
	}

}

onMounted(() => {
	nextTick(() => {
		initAudio();
	})
})

// console.log(playlist.value[0]);
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