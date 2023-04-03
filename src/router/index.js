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
				},
				{
					path: '/music/comment/:id', // 评论
					component: () => import('@/pages/comment/comment.vue'),
					meta: {
						title: '评论详情'
					} 
				}
			]
		}
	]
})

export default router;