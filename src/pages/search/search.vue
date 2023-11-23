<template>
    <!-- 搜索 -->
    <div class="search flex-col">
        <mm-loading v-model:value="mmLoadShow"></mm-loading>
        <div class="search-head">
            <span v-for="(item, index) in Artists" :key="index" @click="clickHot(item.first)">
                {{ item.first }}
            </span>
            <input 
                type="text" 
                placeholder="音乐/歌手" 
                class="search-input"
                v-model.trim="searchValue"
                @keyup.enter="onEnter">
        </div>
        <!-- 搜索结果 -->
        <div class="flex-1 overflow-hidden">
            <music-list
                ref="musicList"
                :list="list" 
                list-type="pullup" 
                @select="selectItem"
                @pullUp="pullupLoad">
            </music-list>
        </div>
    </div>
</template>

<script setup>
import { getCurrentInstance } from "vue";
/*-----组件-----*/
import MmLoading from '@/base/mm-loading/mm-loading.vue';
import MusicList from '@/components/music-list/music-list.vue'
/*-----加载特效混入-----*/
import { loadMixin } from '@/utils/mixin';
/*-----api-----*/
import { search, searchHot, getMusicDetail } from '@/api/index.js'
/*-----util-----*/
import { formatSongs } from '@/utils/song';
import { toHttps } from '@/utils/util';
/*-----pinia-----*/
import { useMusicStore } from '@/store/modules/musicList.js';
const musicStore = useMusicStore();

/*-----控制加载的效果-----*/
let { mmLoadShow, _hideLoad } = loadMixin();

/*-----data------ */
let searchValue = ref(''); // 搜索关键词
let Artists = ref([]); // 热点搜索关键词数组
let page = ref(0); // 分页
let list = ref([]); // 搜索数组
let lockUp = ref(true); // 是否锁定上拉加载事件，默认锁定

/*-----页面实例------ */
const { proxy } = getCurrentInstance();

/*------watch------- */
watch(list, (newList, oldList) => {
    // console.log("变化了");
    if (newList.length !== oldList.length) {
        lockUp.value = false;
    } else if (newList[newList.length - 1].id !== oldList[oldList.length - 1].id) {
        lockUp.value = false;
    }
})


/*-----create-----*/
searchHot().then(({ result }) => { // 热点词获取 获取到了说明网络无问题
    Artists.value = result.hots.slice(0, 5);
    mmLoadShow.value = false;
})


/*-----method-----*/
let clickHot = function (name) { // 点击热词进行搜索
    searchValue.value = name;
    onEnter();
}

let onEnter = function () { // 按回车，搜索事件
    if (searchValue.value.replace(/(^\s+)|(\s+$)/g, '') === '') { // 搜索内容为空
        proxy.$mmToast('搜索内容不能为空');
        return;
    }
    mmLoadShow.value = true;
    page.value = 0; // 第0页
    
    if (list.value.length > 0) { // 重新回到顶部
        proxy.$refs.musicList.scrollTo();
    }

    search(searchValue.value).then(({ result }) => {
        list.value = formatSongs(result.songs);
        // console.log(list.value);
        _hideLoad(); // 隐藏加载
    })
}

let pullupLoad = function () { // 滚动加载事件
    page.value += 1;
    search(searchValue.value, page.value).then(({ result }) => {
        if (!result.songs) {
            proxy.$mmToast("没有更多歌曲啦~~");
            return;
        }
        list.value = [...list.value, ...formatSongs(result.songs)];
    })
}

let _getMusicDetail = function (id) { // 获取歌曲详情 返回歌曲的封面
    return getMusicDetail(id).then((res) => res.songs[0].al.picUrl)
}

let selectItem = async function (music) { // 播放歌曲
    try {
        const image = await _getMusicDetail(music.id);
        music.image = toHttps(image);
        musicStore.selectAddPlay(music);
    } catch(error) {
        console.log(error);
        proxy.$mmToast('哎呀，好像有点问题~')
    }
}
</script>

<style lang="scss" scoped>
.search {
    overflow: hidden;
    height: 100%;
    .search-head {
        display: flex;
        height: 40px;
        padding: 10px 15px;
        overflow: hidden;
        background-color: $search_bg_color;
        span {
            line-height: 40px;
            margin-right: 15px;
            cursor: pointer;
            &:hover {
              color: $text_color_active;  
            }
            @media (max-width: 640px) {
                & {
                    display: none;
                }
            }
        }
        .search-input {
            flex: 1;
            height: 40px;
            box-sizing: border-box;
            padding: 0 15px;
            border: 1px solid $btn_color;
            outline: 0;
            background-color: transparent;
            color: $text_color_active;
            font-size: $font_size_medium;
            box-shadow: 0 0 1px 0 #fff inset;
            &::placeholder {
                color: $text_color;
            }
        }
    }
}
</style>