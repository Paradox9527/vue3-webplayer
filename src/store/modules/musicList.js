import { defineStore } from "pinia";
import { playMode } from '@/config'
import { getHistoryList, getMode } from '@/utils/storage'

export const useMusicStore = defineStore(
	'music',
	{
		state: () => {
			return {
				audioEle: null, // audio元素
				mode: Number(getMode()) || playMode.listLoop, // 播放模式，默认列表循环
				playlist: [], // 播放列表
				orderList: [], // 顺序列表
				historyList: [], // 历史列表
				playing: false, // 播放状态
				currentIndex: -1 // 当前音乐索引
			}
		},
		getters: {
			getaudioEle: (state) => {
				return state.audioEle;
			},
			getPlayMode: (state) => {
				return state.mode;
			},
			getOrderList: (state) => {
				return state.orderList;
			},
			getPlayList: (state) => {
				return state.playlist;
			},
			getPlayingStatus: (state) => {
				return state.playing;
			},
			getCurrentMusic: (state) => {
				return state.playlist[state.currentIndex] || {}
			},
			getCurrentIndex: (state) => {
				return state.currentIndex;
			},
			getHistoryList: (state) => {
				return state.historyList;
			}
		},
		actions: {
			setPlaying(playStatus) { // 设置播放状态
				this.playing = playStatus;
			},
			setPlayList(playList) { // 设置播放列表
				this.playlist = playList;
				this.orderList = playList;
			},
			setOrderList(orderList) {
				this.orderList = orderList;
			},
			setCurrentIndex(index) { //  修改当前音乐索引
				this.currentIndex = index;
			},
			setAudioEle(ele) { // 修改audio元素
				this.audioEle = ele
			},
			setPlayMode(playMode) { // 修改播放模式
				this.mode = playMode
			},
			setHistoryList(historyList) { // 修改播放历史列表
				this.historyList.push(historyList);
			},
			removerPlayListItem(list, index) { // 删除正在播放列表中的歌曲
				let currentIndex = this.currentIndex;
				console.log(currentIndex);
				console.log(this);
				if (index < this.currentIndex || list.length === this.currentIndex) { // 索引比当前所有小，当前播放列表长度等于索引就是最后一个
					currentIndex--;
					this.setCurrentIndex(currentIndex);
				}
				this.setPlayList(list);
				if (!list.length) {
					this.setPlaying(false);
				} else {
					this.setPlaying(true);
				}
			},
			clearPlayList() { // 清空播放列表
				this.setPlaying(false);
				this.setCurrentIndex(-1);
				this.setPlayList([]);
			}
		}
	}
)