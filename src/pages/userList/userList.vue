<template>
    <!-- 我的歌单 -->
    <div class="userList">
        <mm-loading v-model:value="mmLoadShow"></mm-loading>
        <template v-if="list.length > 0">
            <div class="list-item" v-for="item in formatList" :key="item.id" :title="item.name">
                <router-link :to="{ path: `/music/details/${item.id}` }">
                    <div class="userList-item">
                        <img v-lazy="`${item.coverImgUrl}?param=200y200`" class="cover-img">
                        <h3 class="name">{{ item.name }}</h3>
                    </div>
                </router-link>
            </div>
        </template>
        <mm-no-result v-else title="什么也没有，快去登录看看~"></mm-no-result>
    </div>
</template>

<script setup>
/*-----api-----*/
import { getUserPlaylist } from '@/api/index.js';
/*-----组件-----*/
import mmNoResult from '@/base/mm-no-result/mm-no-result.vue';
import MmLoading from '@/base/mm-loading/mm-loading.vue';
/*-----加载特效混入-----*/
import { loadMixin } from '@/utils/mixin';
/*-----pinia-----*/
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
/*-----控制加载的效果-----*/
let { mmLoadShow, _hideLoad } = loadMixin();

/*-----data------ */
let list = ref([]); // 列表

/*----computed-----------*/
let uid = computed(() => { return userStore.getUid })
let formatList = computed(() => {
    console.log(list.value.filter((item) =>item.trackCount > 0));
    return list.value.filter((item) =>item.trackCount > 0)
})

/*------watch------- */
watch(uid, (newUid, oldUid) => {
    if (newUid) {
        mmLoadShow.value = true;
        _getUserPlaylist(newUid);
    } else {
        list.value = [];
    }
})

/*-----create-----*/
if (!uid.value) {
    mmLoadShow.value = false;
}

/*-----onActivated-----*/
onActivated(() => {
    if (uid.value && list.value.length === 0) {
        mmLoadShow.value = true;
        _getUserPlaylist(uid.value);
    } else if (!uid.value && list.value.length !== 0) {
        list.value = [];
    }
})

/*-----method-----*/
const _getUserPlaylist = function (uid) {
    getUserPlaylist(uid).then((res) => {
        if (res.playlist.length === 0) { // 空
            return;
        }
        list.value = res.playlist.slice(1);
        _hideLoad(); // 隐藏加载圈
    })
}

</script>

<style  lang="scss" scoped>
.userList {
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    // &-head {
    //     height: 100%;
    // }
    .list-item {
        float: left;
        width: calc(100% / 7);
        .userList-item {
            width: 130px;
            text-align: center;
            cursor: pointer;
            margin: 0 auto 20px;
            &:hover {
                color: #fff;
            }
            .name {
                height: 30px;
                line-height: 30px;
                font-size: $font_size_medium;
                @include no-wrap();
            }
            @media (max-width: 1100px) {
                width: 80%;
            }
        }
        @media (max-width: 1500px) {
            width: calc(100% / 6);
        }
        @media (max-width: 1400px), (max-width: 960px) {
            width: calc(100% / 5);
        }
        @media (max-width: 1200px), (max-width: 768px) {
            width: calc(100% / 4);
        }
        @media (max-width: 540px){
            width: calc(100% / 3);
        }
    }
}
</style>