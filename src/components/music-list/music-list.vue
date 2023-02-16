<template>
	<!-- 歌曲列表 -->
	<div class="musicList">
		<template v-if="true">
			<!-- 顶部标题 -->
			<div class="list-item list-header">
				<span class="list-name">歌曲</span>
				<span class="list-artist">歌手</span>
				<span v-if="listType === 1" class="list-time">时长</span>
				<span v-else class="list-album">专辑</span>
			</div>
			<!-- 滚动页面 -->
			<div ref="listContent" class="list-content">
				<!-- v-for 循环数据 -->
				<div class="list-item" 
					v-for="(item, index) in list"
					:key="item.id"
					>
					<!-- 序号 -->
					<span class="list-num" v-text="index + 1"></span>
					<!-- 歌曲名称 -->
					<div class="list-name">
						<span>{{ item.name }}</span>
						<div class="list-menu">
							<mm-icon
								class="hover"
								type="play-mini"
								:size="40"
								@click.stop="selectItem(item, index)"
							/>
						</div>
					</div>
					<span class="list-artist">{{ item.singer }}</span>
					<span v-if="listType === 1" class="list-time">
						{{ formatTime(item.duration % 3600) }}
						<mm-icon
							class="hover list-menu-icon-del"
							type="delete-mini"
							:size="40"
						/>
					</span>
					<span v-else class="list-album">{{ item.album }}</span>
				</div>
				<slot name="listBtn"></slot>
			</div>
		</template>
		<mm-no-result v-else title="没有任何东西！！！！"></mm-no-result>
	</div>
</template>

<script setup name="MusicList">
import mmNoResult from '@/base/mm-no-result/mm-no-result.vue';
import { format } from '@/utils/util';
const { proxy } = getCurrentInstance();

const formatTime = function(time) {
	return format(time);
}

const selectItem = function (item, index, e) {
	console.log(item);
	proxy.$mmToast("还没实现播放！")
}

const props = defineProps({
	// 歌曲数据
	list: {
		type: Array,
		default: () => []
	},
	/**
	 * 0：显示专辑栏目（默认）
	 * 1：显示时长栏目
	 */
	listType: {
		type: Number,
		default: 0
	}
})
</script>

<style lang="scss" scoped>
.list-header {
	border-bottom: 1px solid $list_head_line_color;
	color: $text_color_active;
	.list-name {
		padding-left: 40px;
		user-select: none;
	}
}

.list-content {
	width: 100%;
	height: calc(100% - 60px);
	overflow-x: hidden;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}

.list-no {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	color: $text_color;
}

.list-item {
	display: flex;
	width: 100%;
	height: 50px;
	border-bottom: 1px solid $list_item_line_color;
	line-height: 50px;
	overflow: hidden;

	&.list-item-no {
		justify-content: center;
		align-items: center;
	}

	&.on {
    	color: #fff;

    	.list-num {
    		font-size: 0;
    	//   background: url('~assets/img/wave.gif') no-repeat center center;
		}
  	}

	&:hover {
		.list-name {
			padding-right: 80px;
		}
		.list-menu {
    		display: block;
      	}
	}

	&:not([class*='list-header']):hover {
    	.list-name {
    		padding-right: 80px;

    		.list-menu {
    	    	display: block;
    	  	}
    	}

    	.list-time {
    	  	font-size: 0;

    	  	.list-menu-icon-del {
    	    	display: block;
    	  	}
    	}
  	}

	.list-num {
    	display: block;
    	width: 30px;
    	margin-right: 10px;
    	text-align: center;
  	}

	.list-name {
    	position: relative;
    	flex: 1;
    	box-sizing: border-box;

    	& > span {
    		text-overflow: ellipsis;
    		overflow: hidden;
    		display: -webkit-box;
    		-webkit-line-clamp: 1;
    		-webkit-box-orient: vertical;
    	}

    	small {
    	  margin-left: 5px;
    	  font-size: 12px;
    	  color: rgba(255, 255, 255, 0.5);
    	}

    	/*hover菜单*/

    	.list-menu {
    		display: none;
    		position: absolute;
    		top: 50%;
    		right: 10px;
    		height: 40px;
    		font-size: 0;
    		transform: translateY(-50%);
    	}
  	}


	.list-artist,
	.list-album {
		display: block;
		width: 300px;
		@include no-wrap();
		@media (max-width: 1440px) {
			width: 200px;
		}
		@media (max-width: 1200px) {
			width: 150px;
		}
	}

	.list-time {
    	display: block;
    	width: 60px;
    	position: relative;

    .list-menu-icon-del {
      	display: none;
      	position: absolute;
      	top: 50%;
      	left: 0;
      	transform: translateY(-50%);
    }
  }
}

@media (max-width: 960px) {
	.list-item .list-name {
    	padding-right: 70px;
  	}
}

@media (max-width: 768px) {
  	.list-item {
    	.list-name .list-menu {
      		display: block;
    	}

    	.list-artist,
    	.list-album {
      		width: 20%;
    	}
  	}
}

@media (max-width: 640px) {
  	.list-item {
    	.list-artist {
      		width: 80px;
    	}

    	.list-album,
    	.list-time {
      		display: none;
    	}
  	}
}
</style>