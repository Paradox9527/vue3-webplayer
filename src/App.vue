<template>
		<mm-header></mm-header>
		<router-view></router-view>
		<!-- <mm-toast></mm-toast> -->
		<!--播放器-->
    	<audio ref="mmPlayer"></audio>
</template>

<script setup>
import mmHeader from '@/components/mm-header/mm-header.vue';
import { getPlaylistDetail } from '@/api'
import { getCurrentInstance, nextTick } from 'vue';
import { defaultSheetId } from '@/config.js'
import { useMusicStore } from '@/store/modules/musicList.js'

const { proxy } = getCurrentInstance();
const musicStore = useMusicStore(); // pinia

// 隐藏开头动画模块
let loadDom = document.querySelector('#appLoading');
if (loadDom) {
	const animationendFunc = function () {
		loadDom.removeEventListener('animationend', animationendFunc);
		loadDom.removeEventListener('webkitAnimationEnd', animationendFunc);
		document.body.removeChild(loadDom);
		loadDom = null;
	}.bind(this);
	loadDom.addEventListener('animationend', animationendFunc);
	loadDom.addEventListener('webkitAnimationEnd', animationendFunc);
	loadDom.classList.add('removeAnimate');
}

// created函数，因为vue3无该钩子了 
getPlaylistDetail(defaultSheetId).then((playlist) => {
	const list = playlist.tracks.slice(0, 100);
	musicStore.setPlayList(list);
	musicStore.setOrderList(list);
})
nextTick(() => {
	musicStore.setAudioEle(proxy.$refs.mmPlayer);
})
</script>

<style lang="scss">
#mmPlayer {
	position: relative;
	width: 100%;
	height: 100%;
	color: $text_color;
	font-size: $font_size_medium;
	.router-view {
		width: 100%;
		height: 100%;
	}
}
</style>