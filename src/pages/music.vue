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
		<div class="music-bar">
			<div class="music-bar-btns">
				<mmIcon
					class="pointer"
					type="prev"
					:size="36"
					title="上一曲 Ctrl + Left"
				/>
				<div class="control-play pointer" title="播放暂停 Ctrl + Space">
					<mm-icon type="play" :size="24" />
				</div>
				<mmIcon
					class="pointer"
					type="next"
					:size="36"
					title="下一曲 Ctrl + Right"
				/>
			</div>

			<div class="music-music">
				<div class="music-bar-info">
					<template v-if="false">
						
					</template>
					<template v-else>
						欢迎使用vue3-player在线音乐播放器
					</template>
				</div>
				<!-- 时间 -->
				<div class="music-bar-time">
					23/59/59
				</div>
				<!-- 进度条 -->
			</div>
			<!-- 播放模式 -->
			<mmIcon
				class="icon-color pointer mode"
				type="loop"
				:size="30"
				title="循环播放"
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