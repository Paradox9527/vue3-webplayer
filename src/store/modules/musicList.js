import { defineStore } from "pinia";

export const useMusicStore = defineStore(
	'music',
	{
		state: () => {
			return {
				playlist: [], // 播放列表
				orderList: [], // 顺序列表
				historyList: [], // 历史列表
			}
		},
		getters: {
			getPlayList: (state) => {
				return state.playlist;
			}
		},
		actions: {
			setPlayList(playList) {
				this.playlist = playList;
			}
		}
	}
)