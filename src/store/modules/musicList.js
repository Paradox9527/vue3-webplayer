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
			setPlaying(playStatus) {
				this.playing = playStatus;
			},
			setPlayList(playList) {
				this.playlist = playList;
			},
			setCurrentIndex(index) {
				this.currentIndex = index;
			},
			setAudioEle(ele) {
				this.audioEle = ele
			}
		}
	}
)