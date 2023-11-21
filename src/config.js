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

// 默认背景图（可引入网络图或本地静态图
const req = import.meta.globEager('assets/background/*.jpg');
// console.log(req);
// const index = Math.floor(Math.random() * 5);
const index = 1;
const path = `/src/assets/background/bg-${index}.jpg`;
export const bgUrl = req[path]?.default;
