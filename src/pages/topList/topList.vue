<template>
    <!-- 排行榜 -->
    <div class="topList">
        <mm-loading v-model:value="mmLoadShow"></mm-loading>
        <template v-if="!mmLoadShow">
            <div class="topList-head">云音乐特色榜</div>
            <div class="topList-content">
                <div class="list-item" v-for="(item, index) in data.list.value" :key="index" :title="`${item.name}-${item.updateFrequency}`">
                    <router-link :to="{ path: `/music/details/${item.id}`}" custom>
                        <div class="topList-item" @click="openDialog">
                            <div class="topList-img">
                                <img v-lazy="`${item.coverImgUrl}?param=300y300`" class="cover-img" />
                            </div>
                            <h3 class="name">{{ item.name }}</h3>
                        </div>
                    </router-link>
                </div>
            </div>
            <div class="topList-head">热门歌单</div>
            <div class="topList-content">
                <div class="list-item" v-for="(item, index) in data.hotList.value" :key="index" :title="item.name">
                    <router-link :to="{ path: `/music/details/${item.id}` }" custom>
                        <div class="topList-item" @click="openDialog">
                            <div class="topList-img">
                                <img v-lazy="`${item.picUrl}?param=300y300`" class="cover-img" />
                            </div>
                            <h3 class="name">{{ item.name }}</h3>
                        </div>
                    </router-link>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
/*-------api----------- */
import { getToplistDetail, getPersonalized } from '@/api/index'
import MmLoading from '@/base/mm-loading/mm-loading.vue'
import { loadMixin } from '@/utils/mixin'
// 复用混入的使用方式
let { mmLoadShow, _hideLoad } = loadMixin();

let { proxy } = getCurrentInstance();

let data = reactive({
    list: [], // 云音乐特色榜单
    hotList: [] // 热门歌单
})

/*---------- create----- */ 
Promise.all([getToplistDetail(), getPersonalized()])
    .then(([topList, hotList]) => { // 获取热门，top 排行榜
        data.list.value = topList.list.filter((v) => v.ToplistType);
        data.hotList.value = hotList.result.slice();
        // console.log(data.list.value);
        // console.log(data.hotList.value);
        _hideLoad();
    })
    .catch(() => {})

const openDialog = function () {
    proxy.$mmToast("还没重构好~")
}
</script>

<style lang="scss" scoped>
.topList {
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    &-head {
        width: 100%;
        height: 34px;
        line-height: 34px;
        padding: 20px 0;
        font-size: $font_size_large;
        color: $text_color_active;
    }
    &-content {
        overflow: hidden;
    }
    .list-item {
        float: left;
        width: calc(100% / 7);
        .topList-item {
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
        @media (max-width: 1280px), (max-width: 768px) {
            width: calc(100% / 4);
        }
        @media (max-width: 540px) {
            width: calc(100% / 3);
        }
        .topList-img {
            position: relative;
            padding-top: 100%;
            width: 100%;
            height: 0;
            .cover-img {
                position: absolute;
                top: 0;
                left: 0;
            }   
        }
    }
}
</style>