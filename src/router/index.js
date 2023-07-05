import { createRouter, createWebHashHistory } from "vue-router";
// import music from '@/pages/music.vue'
const router = createRouter({
	history: createWebHashHistory(), // 路由模式
	routes: [
		{
			path:'/',
			redirect: '/music'
		},
		{
			path:'/music',
			component: () => import('@/pages/music.vue'),
			redirect: '/music/playlist',
			children: [
				{
					path: '/music/playlist', // 正在播放列表
					component: () => import('@/pages/playList/playList.vue'),
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/music/userlist', // 我的歌单
					component: () => import('@/pages/userList/userList.vue'),
					meta: {
						title: '我的歌单',
						keepAlive: true
					}
				},
				{
					path: '/music/toplist', // 排行榜列表
					component: () => import('@/pages/topList/topList.vue'),
					meta: {
						title: '排行榜',
						keepAlive: true
					}
				},
				{
					path: '/music/historylist', // 历史记录列表
					component: () => import('@/pages/historyList/historyList.vue'),
					meta: {
						title: '我听过的'
					}
				},
				{
					path: '/music/search', // 搜索
					component: () => import('@/pages/search/search.vue'),
					meta: {
						title: '搜索',
						keepAlive: true
					}
				},
				{
					path: '/music/comment/:id', // 评论
					component: () => import('@/pages/comment/comment.vue'),
					meta: {
						title: '评论详情'
					} 
				},
				{
					path: '/music/details/:id', // 音乐详情列表
					component: () => import('@/pages/details/details.vue')
				}
			]
		}
	]
})

export default router;