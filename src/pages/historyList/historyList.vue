<template>
    <!-- 我听过的（播放历史） -->
    <div class="historyList">
        <music-list
            :list="historyList"
            list-type="duration"
            @select="selectItem"
            @del="deleteItem">
            <template v-slot:listBtn>
				<div class="list-btn">
					<span @click="$refs.dialog.show()">清空列表</span>
				</div>
      		</template>
        </music-list>
        <MnDialog
			ref="dialog"
			body-text="是否清空正在播放列表"
			confirm-btn-text="清空"
			@confirm="clearList"
		></MnDialog>
    </div>
</template>

<script setup>
/*--------组件--------- */
import MusicList from '@/components/music-list/music-list.vue';
import MnDialog from '@/base/mm-dialog/mm-dialog.vue';

/*---------pinia---------- */
import { useMusicStore } from '@/store/modules/musicList.js';
const musicStore = useMusicStore();

/*-------computed--------------*/
let historyList = computed(() => { return musicStore.getHistoryList });
// let playing = computed(() => { return musicStore.getPlayingStatus });
// let currentMusic = computed(() => { return musicStore.getCurrentMusic });

/*------------this--------*/
const { proxy } = getCurrentInstance();

// console.log(historyList.value);
// console.log(playing.value);
// console.log(currentMusic.value);

/*-------methods--------------*/
const selectItem = function(item, index) { // 播放事件
    musicStore.selectPlay(historyList.value, index)
}

const deleteItem = function(index) { // 删除事件
	let list = [...historyList.value];
	list.splice(index, 1);
	musicStore.removeHistory(list);
	proxy.$mmToast("删除成功");
}

const clearList = function () { // 清空事件
	musicStore.clearHistory();
	proxy.$mmToast('列表清空成功')
}
</script>

<style lang="scss" scoped>
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
</style>