import { defineStore } from "pinia";
import { playMode } from '@/config'
import { getHistoryList, getMode } from '@/utils/storage'

let findIndex = function (list, music) {
	return list.findIndex((item) => {
		return item.id === music.id
	})
}

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
				return this.playlist[this.currentIndex] || {}
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
			},
			selectPlay () { // 选择播放

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