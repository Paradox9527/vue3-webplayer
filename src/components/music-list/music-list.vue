<template>
	<!-- 歌曲列表 -->
	<div class="music-list flex-col">
		<template v-if="list.length > 0">
			<!-- 顶部标题 -->
			<div class="list-item list-header">
				<span class="list-name">歌曲</span>
				<span class="list-artist">歌手</span>
				<span v-if="isDuration" class="list-time">时长</span>
				<span v-else class="list-album">专辑</span>
			</div>
			<!-- 滚动页面 -->
			<div ref="listContent" class="list-content" @scroll="listScroll($event)">
				<!-- v-for 循环数据 -->
				<div class="list-item" 
					:class="{ on: playing && currentMusic.id === item.id }"
					v-for="(item, index) in list"
					:key="item.id"
					@dblclick="selectItem(item, index, $event)"
					>
					<!-- 序号 -->
					<span class="list-num" v-text="index + 1"></span>
					<!-- 歌曲名称 -->
					<div class="list-name">
						<span>{{ item.name }}</span>
						<div class="list-menu">
							<mm-icon
								class="hover"
								:type="getPlayIconType(item)"
								:size="40"
								@handleclick.stop="selectItem(item, index, $event)"
							/>
						</div>
					</div>
					<span class="list-artist">{{ item.singer }}</span>
					<span v-if="isDuration" class="list-time">
						{{ formatTime(item.duration % 3600) }}
						<mm-icon
							class="hover list-menu-icon-del"
							type="delete-mini"
							:size="40"
							@handleclick.stop="deleteItem(index)"
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
import { useMusicStore } from '@/store/modules/musicList.js'

const { proxy } = getCurrentInstance();
const emit = defineEmits(['select', 'del','pullUp']);
const musicStore = useMusicStore();
const lockUp = ref(true); // 是否锁定滚动加载事件，默认锁定
const scrollTop = ref(0);

/*-------列表类型------- */
const LIST_TYPE_ALBUM = 'album';
const LIST_TYPE_DURATION = 'duration';
const LIST_TYPE_PULLUP = 'pullup';
const THRSHOLD = 100; // 触发滚动的阈值

// 计算属性
const currentMusic = computed(() => { return musicStore.getCurrentMusic; })
const playing = computed(() => { return musicStore.getPlayingStatus; })
const isDuration = computed(() => {
	return props.listType === LIST_TYPE_DURATION;
})

// props
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
		type: String,
		default: 'album',
	}
})

//watch
watch(() => props.list, (newList, oldList) => {
	if (props.listType !== LIST_TYPE_PULLUP) {
		return
	}
	if (newList.length !== oldList.length) {
		lockUp.value = false;
	} else if (newList[newList.length - 1].id !== oldList[oldList.length - 1].id) {
		lockUp.value = false;
	}
}) 

// method
// 格式化时间
const formatTime = function(time) {
	return format(time);
}
// 播放暂停事件
const selectItem = function (item, index, e) {
	if (e && /list-menu-icon-del/.test(e.target.className)) {
        return;
    }
	if (currentMusic.value.id && item.id === currentMusic.value.id) {
		musicStore.setPlaying(!playing.value);
		return;
	}
	emit('select', item, index)
}
// 获取播放状态
const getPlayIconType = function (itemId) {
	return playing.value && currentMusic.value.id === itemId.id ?  'pause-mini' : 'play-mini'
}
// 删除事件
const deleteItem = function (index) {
	emit('del', index)
}
// 回到顶部
const scrollTo = function () {
	proxy.$refs.listContent.scrollTop = 0;
}
// 滚动事件
const listScroll = function (e) {
	const eventScrollTop = e.target.scrollTop;
	scrollTop.value = eventScrollTop;
	if (props.listType !== LIST_TYPE_PULLUP || lockUp.value) {
		return;
	}
	const { scrollHeight, offsetHeight } = e.target;
	if (eventScrollTop + offsetHeight >= scrollHeight - THRSHOLD) {
		lockUp.value = true; // 锁定滚动加载
		emit('pullUp')
	}
}
onActivated(() => {
	// console.log("激活了");
	scrollTop.value && proxy.$refs.listContent && (proxy.$refs.listContent.scrollTop = scrollTop.value)
})

defineExpose({ // 暴露组件方法
	scrollTo
})
</script>

<style lang="scss" scoped>
.music-list {
	height: 100%;
}
.list-header {
	border-bottom: 1px solid $list_head_line_color;
	color: $text_color_active;
	.list-name {
		padding-left: 40px;
		user-select: none;
	}
}

.list-content {
	flex: 1;
	// width: 100%;
	// height: calc(100% - 60px);
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
    	  background: url('@/assets/images/wave.gif') no-repeat center center;
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