// 默认分页数量
export const defaultLimit = 30

/**
 * 默认歌单ID （正在播放列表）
 * 默认云音乐热歌榜 https://music.163.com/#/discover/toplist?id=3778678
 * 如需要修改自定义歌单的请修改
 * @type {number}
 */
export const defaultSheetId = 3778678

/**
 * 播放模式
 * listLoop: 列表循环
 * order：顺序
 * loop: 单曲循环
 * random: 随机
 */
export const playMode = {
	listLoop: 0,
	order: 1,
	random: 2,
	loop: 3
}

// 默认音量
export const defaultVolume = 0.8