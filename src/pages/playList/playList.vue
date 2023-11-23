<template>
	<!-- 正在播放 -->
	<div class="playList">
		<music-list
			:list="playlist"
			list-type="duration"
			@select="selectItem"
			@del="deleteItem"
		>
			<template v-slot:listBtn>
				<div class="list-btn">
					<span @click="$refs.dialog.show()">清空列表</span>
				</div>
      		</template>
		</music-list>
		<mm-dialog
			ref="dialog"
			body-text="是否清空正在播放列表"
			confirm-btn-text="清空"
			@confirm="clearList"
		></mm-dialog>
	</div>
</template>

<script setup name="playList">
import musicList from '@/components/music-list/music-list.vue';
import MmDialog from '@/base/mm-dialog/mm-dialog.vue'
import { useMusicStore } from '@/store/modules/musicList.js'
import { getCurrentInstance } from 'vue';

const musicStore = useMusicStore();
const { proxy } = getCurrentInstance();

// 计算属性
const playing = computed(() => { return musicStore.getPlayingStatus; })
const playlist = computed(() => { return musicStore.getPlayList; })
const currentMusic = computed(() => { return musicStore.getCurrentMusic; })

// method
// 播放暂停事件
const selectItem = function (item, index) {
	if (item.id !== currentMusic.id) {
		musicStore.setCurrentIndex(index)
		musicStore.setPlaying(true)
	}
}
// 删除事件
const deleteItem = function (index) {
	console.log(index);
	let list = [...playlist.value];
	list.splice(index, 1);
	// console.log(list);
	musicStore.removerPlayListItem(list, index);
	proxy.$mmToast("删除成功");
}
// 清空列表事件
const clearList = function () {
	musicStore.clearPlayList();
	proxy.$mmToast('列表清除成功')
}
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