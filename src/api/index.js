import axios from "@/utils/axios";
import { defaultLimit } from "@/config"
import { formatSongs } from '@/utils/song'

axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_API

// 排行榜列表
export function getToplistDetail() {
	return axios.get('/toplist/detail')
}

// 推荐歌单
export function getPersonalized() {
	return axios.get('/personalized')
}

// 获取用户歌单详情
export function getUserPlaylist(uid) {
	return axios.get('/user/playlist', {
		params: {
			uid
		}
	})
}

// 歌单详情
export function getPlaylistDetail(id) {
	return new Promise((resolve, reject) => {
		axios.get('/playlist/detail', {
			params: { id }
		})
		.then(({ playlist }) => playlist || {})
		.then(playlist => {
			const { trackIds, tracks } = playlist
		  	if (!Array.isArray(trackIds)) {
				reject(new Error('获取歌单详情失败'))
				return
		  	}
		  	// 过滤完整歌单 如排行榜
		  	if (tracks.length === trackIds.length) {
				playlist.tracks = formatSongs(playlist.tracks)
				resolve(playlist)
				return
		  	}
		  	// 限制歌单详情最大 500
		  	const ids = trackIds.slice(0, 500).map(v => v.id).toString();

		  	getMusicDetail(ids).then(({ songs }) => {
				playlist.tracks = formatSongs(songs)
				resolve(playlist)
		  	})
		})
	})
}

// 获取歌曲详情
export function getMusicDetail(ids) {
	return axios.get('/song/detail', {
	  	params: {
			ids
	  	}
	})
}

// 获取歌词
export function getLyric(id) {
	const url = '/lyric'
	return axios.get(url, {
		params: {
			id
		}
	})
}

// 获取音乐评论
export function getComment(id, page, limit = defaultLimit) {
	return axios.get('/comment/music', {
		params: {
			offset: page * limit,
			limit: limit,
			id
		}
	})
}

// 搜索
export function search(keywords, page = 0, limit = defaultLimit) {
	return axios.get('/search', {
		params: {
			offset: page * limit,
			limit: limit,
			keywords,
		}
	})
}

// 热点搜索
export function searchHot() {
	return axios.get('/search/hot')
}