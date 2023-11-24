import { defineStore } from "pinia";
import { clearHistoryList, removeHistoryList, getHistoryList,  setHistory, getMode, setMode } from '@/utils/storage'

let findIndex = function (list, music) {
	return list.findIndex((item) => item.id === music.id)
}

export const useMusicStore = defineStore(
	'music',
	{
		state: () => {
			return {
				audioEle: null, // audio元素
				mode: getMode(), // 播放模式，默认列表循环
				playlist: [], // 播放列表
				orderList: [], // 顺序列表
				historyList: getHistoryList() || [], // 历史列表
				playing: false, // 播放状态
				currentIndex: -1 // 当前音乐索引
			}
		},
		getters: {
			getaudioEle() {
				// console.log(this); 写成箭头函数的形式时候，要调用上面的this。因为箭头函数的this没办法获得函数上下文
				return this.audioEle;
			},
			getPlayMode() {
				return this.mode;
			},
			getOrderList() {
				return this.orderList;
			},
			getPlayList() {
				return this.playlist;
			},
			getPlayingStatus() {
				return this.playing;
			},
			getCurrentMusic() {
				return this.playlist[this.currentIndex] || {};
			},
			getCurrentIndex() {
				return this.currentIndex;
			},
			getHistoryList() {
				return this.historyList;
			}
		},
		// 异步逻辑的部分 主要涉及调用接口等
		actions: {
			setPlaying(playStatus) { // 设置播放状态
				this.playing = playStatus;
			},
			setOrderList(orderList) {
				this.orderList = orderList;
			},
			setPlayList(playList) { // 设置播放列表
				this.playlist = playList;
			},
			setCurrentIndex(index) { //  修改当前音乐索引
				this.currentIndex = index;
			},
			setAudioEle(ele) { // 修改audio元素
				this.audioEle = ele
			},
			setPlayMode(playMode) { // 修改播放模式
				let mode = setMode(playMode);
				this.mode = mode;
			},
			setHistoryList(historyList) { // 修改播放历史列表
				let list = setHistory(historyList);
				this.historyList = list;
			},
			removeHistory(music) { // 删除历史记录
				let list = removeHistoryList(music);
				this.historyList = list;
			},
			clearHistory() { // 清空播放历史
				let list = clearHistoryList();
				this.historyList = list;
			},
			removerPlayListItem(list, index) { // 删除正在播放列表中的歌曲
				let currentIndex = this.currentIndex;
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
				this.setOrderList([]);
			},
			selectPlay (list, index) { // 选择播放
				this.setPlayList(list);
				this.setOrderList(list);
				this.setCurrentIndex(index);
				this.setPlaying(true);
			},
			selectAddPlay (music) { // 选择播放（会插入一条到播放列表）
				let list = [...this.playlist];
				let index = findIndex(list, music);
				if (index > -1) {
					this.setCurrentIndex(index);
				} else {
					list.unshift(music);
					this.setPlayList(list); // 设置播放列表
					this.setOrderList(list); // 设置历史播放列表
					this.setCurrentIndex(0); // 设置当前索引
				}
				this.setPlaying(true); // 播放
			}
		}
	}
)