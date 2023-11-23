<template>
	<div>
		<!-- 封面 -->
		<dl class="music-info">
			<dt>
				<img :src="musicPicUrl">
			</dt>
			<template v-if="currentMusic.id">
				<dd>歌曲名: {{ currentMusic.name }}</dd>
				<dd>歌手名：{{ currentMusic.singer }}</dd>
				<dd>专辑名：{{ currentMusic.album }}</dd>
			</template>
			<template v-else>
				<dd>musicPlayer在线音乐播放器</dd>
				<dd>
					<a class="hover" target="_blank" href="https://github.com/Paradox9527">
						<mm-icon type="github" :size="14"/>&nbsp;Paradox9527
					</a>
				</dd>
			</template>
		</dl>
		<!-- 歌词 -->
		<div ref="musicLyric" class="music-lyric">
			<div class="music-lyric-items" :style="lyricTop">
				<p v-if="!currentMusic.id">没有音乐正在播放！</p>
				<p v-else-if="props.nolyric">这歌好像没有歌词~</p>
				<template v-else-if="props.lyric.length > 0">
					<p v-for="(item, index) in props.lyric" :key="index" :class="{ on: props.lyricIndex === index }">
						{{ item.text }}
					</p>
				</template>
				<p v-else>歌词加载失败</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useMusicStore } from '@/store/modules/musicList.js'
import { getCurrentInstance } from 'vue';
import picUrl from '../../assets/images/player_cover.png';

const { proxy } = getCurrentInstance();
const musicStore = useMusicStore(); // pinia
const top = ref(0);
const resizeTimer = ref();

// 计算属性
const currentMusic = computed(() => { return musicStore.getCurrentMusic }); // 当前音乐
const musicPicUrl = computed(() => {
	return currentMusic.value.id
	? `${currentMusic.value.image}?param=300y300`
	: picUrl
}); // 当前音乐专辑图片
const lyricTop = computed(() => {
	return `transform :translate3d(0, ${-34 * (props.lyricIndex - top.value)}px, 0)`
}); // 每条歌词的高度

// 自定义属性
const props = defineProps({
	// 歌词数据
	lyric: {
		type: Array,
		default: () => []
	},
	// 是否无歌词
	nolyric: {
		type: Boolean,
		default: false
	},
	// 当前歌词下标
	lyricIndex: {
		type: Number,
		default: 0
	}
})

// 方法method
const clacTop = function () { // 计算歌词居中的top值
	const dom = proxy.$refs.musicLyric;
	const { display = '' } = window.getComputedStyle(dom)
	if (display === 'none') {
		return;
	}
	const height = dom.offsetHeight;
	top.value = Math.floor(height / 34 / 2);
}

// 生命周期函数
onMounted(() => {
	window.addEventListener('resize', (params) => {
		if (resizeTimer.value) {
			clearTimeout(resizeTimer.value);
		}
		resizeTimer.value = setTimeout(() => {
			clacTop()
		}, 60)
	})
	nextTick(() => {
		clacTop()
	})
})

</script>

<style lang="scss" scoped>
.music-info {
	padding-bottom: 20px;
	text-align: center;
	font-size: $font_size_medium;
	dt {
		position: relative;
		width: 186px;
		height: 186px;
		margin: 0 auto 15px;
		&:after {
			content: '';
			position: absolute;
			left: 9px;
			top: 0px;
			width: 201px;
			height: 180px;
			background: url('@/assets/images/album_cover_player.png') 0 0 no-repeat;
		}
		img {
			vertical-align: middle;
			width: 186px;
			height: 186px;
		}
	}
	dd {
		height: 30px;
		line-height: 30px;
		@include no-wrap();
	}
}

// 歌词部分
.music-lyric {
	position: absolute;
	top: 315px;
	right: 0px;
	bottom: 0px;
	left: 0px;
	overflow: hidden;
	text-align: center;
	mask-image: linear-gradient(
		to bottom,
		rgba(255, 255, 255, 0) 0,
		rgba(255, 255, 255, 0.6) 15%,
    	rgba(255, 255, 255, 1) 25%,
    	rgba(255, 255, 255, 1) 75%,
    	rgba(255, 255, 255, 0.6) 85%,
    	rgba(255, 255, 255, 0) 100%
	);
	-webkit-mask-image: linear-gradient(
		to bottom,
		rgba(255, 255, 255, 0) 0,
		rgba(255, 255, 255, 0.6) 15%,
    	rgba(255, 255, 255, 1) 25%,
    	rgba(255, 255, 255, 1) 75%,
    	rgba(255, 255, 255, 0.6) 85%,
    	rgba(255, 255, 255, 0) 100%
	);
	.music-lyric-items {
		text-align: center;
		line-height: 34px;
		font-size: $font_size_small;
		transform: translate3d(0, 0, 0);
		transition: transform 0.6s ease-out;
		@include no-wrap();
		.on {
			color: $lyric_color_active;
		}
	}
}

@media (max-width: 960px) {
	.music-info {
		display: none;
	}
	.music-lyric {
		top: 0;
	}
}
</style>