<template>
	<!-- 选项 -->
	<div class="music-btn">
		<router-link to="/music/playlist" custom v-slot="btnPlaylist"><span @click="btnPlaylist">正在播放</span></router-link>
		<router-link to="/music/toplist" custom v-slot="btnToplist"><span @click="btnToplist">推荐</span></router-link>
		<router-link to="/music/search" custom v-slot="btnSearch"><span @click="btnSearch">搜索</span></router-link>
		<router-link to="/music/userlist" custom v-slot="btnUserlist"><span @click="btnUserlist">我的歌单</span></router-link>
		<span class="show-960">歌词</span>
		<router-link to="/music/historylist" custom v-slot="btnHistorylist"><span @click="btnHistorylist">我听过的</span></router-link>
	</div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.music-btn {
	width: 100%;
	height: 60px;
	font-size: 0;
	white-space: nowrap;
	overflow-x: auto;
	-webkit-overflow-scrolling: touch;
	span {
		display: inline-block;
		height: 40px;
		box-sizing: border-box;
		margin-right: 8px;
		padding: 0 23px;
		border: 1px solid $btn_color;
		color: $btn_color;
		border-radius: 2px;
		font-size: 14px;
		line-height: 40px;
		overflow: hidden;
		cursor: pointer;
		&:nth-last-of-type(1) {
			margin: 0;
		}
		&:hover,
		&.active {
			border-color: $btn_color_active;
			color: $btn_color_active;
		}
	}
	@media (min-width: 960px) {
		span.show-960 {
			display: none;
    	}
	}
	@media (max-width: 960px) {
		span.show-960 {
			display: inline-block;
    	}
	}
	@media (max-width: 768px) {
		height: 50px;
		span {
			height: 35px;
			padding: 0 10px;
			margin-right: 6px;
			line-height: 35px;
		}
  	}
}
</style>