<template>
	<div class="mm-header">
		<h1 class="header">
			<a href="https://music.163.com/" target="_blank">
				vue3-Player 在线音乐播放器
			</a>
		</h1>
		<dl class="user">
			<template v-if="user.info.userId">
				<router-link class="user-info" to="/music/userlist" tag="dt">
					<img class="avatar" :src="`${user.info.avatarUrl}?param=50y50`" />
					<span>{{ user.info.nickname }}</span>
				</router-link>
				<dd  class="user-btn" @click="openDialog(2)">退出</dd>
			</template>
			<dd v-else class="user-btn" @click="openDialog(0)">登录</dd>
		</dl>
		<mm-dialog 
			ref="loginDialog" 
			head-text="登录" 
			confirm-btn-text="登录"
			cancel-btn-text="关闭"
			@confirm="login" 
			>
			<div class="mm-dialog-text">
				<input
					v-model.trim="uidValue" 
					type="number" 
					class="mm-dialog-input" 
					autofocus 
					placeholder="请输入您的网易云 UID"
					>
			</div>
			<template v-slot:btn><div @click="openDialog(1)">帮助</div></template>
		</mm-dialog>
		 <!--帮助-->
		 <mm-dialog ref="helpDialog" head-text="登录帮助" confirm-btn-text="去登录" cancel-btn-text="关闭" @confirm="openDialog(0)">
    	  <div class="mm-dialog-text">
    	    <p>
    	      1、
    	      <a target="_blank" href="https://music.163.com">
    	        点我(https://music.163.com)
    	      </a>
    	      打开网易云音乐官网
    	    </p>
    	    <p>2、点击页面右上角的“登录”</p>
    	    <p>3、点击您的头像，进入我的主页</p>
    	    <p>4、复制浏览器地址栏 /user/home?id= 后面的数字（网易云 UID）</p>
    	  </div>
    	</mm-dialog>
		 <!--退出-->
		 <mm-dialog
		 	ref="outDialog"
			body-text="确定退出当前用户吗？"
			@confirm="out">
		</mm-dialog>
	</div>
</template>

<script setup>
import { getUserPlaylist } from '@/api';
import mmDialog from '@/base/mm-dialog/mm-dialog.vue';
import { toHttps } from '@/utils/util';
import { reactive } from '@vue/reactivity';
import { useUserStore } from '@/store/modules/user'

const { proxy } = getCurrentInstance();
const userStore = useUserStore();
// console.log(userStore);
let user = reactive({
	info:{}
});
let uidValue = ref('');
const openDialog = function (key) {
	switch (key) {
		case 0:
			proxy.$refs.loginDialog.show();
			break;
		case 1:
			proxy.$refs.loginDialog.hide();
			proxy.$refs.helpDialog.show();
			break;
		case 2:
			proxy.$refs.outDialog.show();
		case 3:
			proxy.$refs.loginDialog.hide();
		default:
		break;
	}
}
// 登录
let login = function () {
	if (uidValue.value === '') {
		proxy.$mmToast("uid不能为空");
		openDialog(0);
		return
	}
	openDialog(3)
	_getUserPlaylist(uidValue.value)
}
// 退出
let out = function () {
	user.info = {};
	userStore.saveUserId(null);
	// console.log(userStore);
	proxy.$mmToast('退出成功')
}

let _getUserPlaylist = function(uid) {
	getUserPlaylist(uid).then(({ playlist = [] }) => {
		uidValue.value = '';
		if (playlist.length === 0 || !playlist[0].creator) {
			proxy.$mmToast(`未查询找 UID 为 ${uid} 的用户信息`)
			return;
		}
		const creator = playlist[0].creator;
		creator.avatarUrl = toHttps(creator.avatarUrl)
		// user = reactive(creator);
		user.info = creator
		// userStore.uid = user.info.userId;
		userStore.saveUserId(user.info.userId);
		// console.log(userStore.uid);
		setTimeout(() => {
        	proxy.$mmToast(`${user.info.nickname} 欢迎使用 mmPlayer`)
        }, 200)
	})
}

if (userStore.uid) {
	console.log("已登录" + userStore.uid);
	_getUserPlaylist(userStore.uid)
}
</script>

<style lang="scss">
.mm-header {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 60px;
	@media (max-width: 768px) {
		background: $header_bg_color;
	}
	.header {
		text-align: center;
		line-height: 60px;
    	color: $text_color_active;
    	font-size: $font_size_large;
    	@media (max-width: 768px) {
      		padding-left: 15px;
      		text-align: left;
    	}
	}
	.user {
		position: absolute;
		top: 50%;
		right: 15px;
		line-height: 30px;
		text-align: right;
		transform: translateY(-50%);
		color: $text_color;
		&-info {
			float: left;
			margin-left: 15px;
			cursor: pointer;
			.avatar {
				width: 30px;
				height: 30px;
				border-radius: 90px;
				vertical-align: middle;
			}
			span {
				margin-left: 10px;
				color: $text_color_active;
			}
		}
		&-btn {
			float: left;
			cursor: pointer;
			&:hover {
				color: $text_color_active;
			}
		}
		@media (max-width: 768px) {
      		&-info {
        		margin-right: 10px;
        		span {
          			display: none;
        		}
      		}
    	}
	}
}
.mm-dialog-text {
  text-align: left;
  .mm-dialog-input {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    padding: 0 15px;
    border: 1px solid $btn_color;
    outline: 0;
    background: transparent;
    color: $text_color_active;
    font-size: $font_size_medium;
    box-shadow: 0 0 1px 0 #fff inset;
    &::placeholder {
      color: $text_color;
    }
  }
  a:hover {
    color: #d43c33;
  }
}
</style>