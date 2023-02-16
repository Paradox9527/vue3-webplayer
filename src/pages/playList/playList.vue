<template>
	<!-- 正在播放 -->
	<div class="playList">
		<music-list
			:list="playlist"
			:list-type="1"
			@select="selectItem"
		>
			<template v-slot:listBtn >
				<div class="list-btn">
					<span >清空列表</span>
				</div>
      		</template>
		</music-list>
	</div>
</template>

<script setup name="playList">
import musicList from '@/components/music-list/music-list.vue';
import { useMusicStore } from '@/store/modules/musicList.js'

const musicStore = useMusicStore()

const playing = computed(() => { return musicStore.getPlayingStatus; })
const playlist = computed(() => { return musicStore.getPlayList; })
const currentMusic = computed(() => { return musicStore.getCurrentMusic; })

// 播放暂停事件
const selectItem = function (item, index) {
	if (item.id !== currentMusic.id) {
		musicStore.setCurrentIndex(index)
		musicStore.setPlaying(true)
	}
}
// console.log(playlist);

</script>

<style lang="scss">
.playList {
	position: relative;
	width: 100%;
	height: 100%;
	.musicList {
		width: 100%;
		height: 100%;
	}
	.list-btn {
		display: flex;
    	justify-content: center;
		align-items: center;
		height: 50px;
		span {
			padding: 5px 20px;
			cursor: pointer;
			user-select: none;
			&:hover {
				color: $text_color_active;
			}
		}
    }
}
</style>