<template>
    <div class="comment">
        <mmLoading v-model:value="mmLoadShow"></mmLoading>
        <dl class="comment-list">
            <!-- 标题 精彩评论 -->
            <dt class="comment-title">精彩评论</dt>
            <!-- item -->
            <dd v-for="item in data.hotComments" :key="item.commentId" class="comment-item">
                <a target="_blank" :href="`https://music.163.com/#/user/home?id=${item.user.userId}`">
                    <img v-lazy="`${item.user.avatarUrl}?param=50y50`" class="comment-item-pic">
                    <h2 class="comment-item-title">{{ item.user.nickname }}</h2>
                </a>
                <p class="comment-item-disc">{{ item.content }}</p>
                <div class="comment-item-opt">
                    <span class="comment-opt-date">{{ format(item.time) }}</span>
                    <span class="comment-opt-liked">
                        <mm-icon type="good"></mm-icon>
                        {{ item.likedCount }}
                    </span>
                </div>
            </dd>
            <!-- 最新评论 -->
            <dt class="comment-title">最新评论（{{ data.total }}）</dt>
            <dd v-for="item in data.commentList" :key="item.commentId" class="comment-item">
                <a target="_blank"  class="comment-item-pic" :href="`https://music.163.com/#/user/home?id=${item.user.userId}`">
                    <img v-lazy="`${item.user.avatarUrl}?param=50y50`" class="cover-img">
                </a>
                <h2 class="comment-item-title">
                    <a :href="`https://music.163.com/#/user/home?id=${item.user.userId}`"></a>
                    {{ item.user.nickname }}
                </h2>
                <p class="comment-item-disc">{{ item.content }}</p>
                <div v-for="beReplied in item.beReplied" :key="beReplied.user.userId" class="comment-item-replied">
                    <a :href="`https://music.163.com/#/user/home?id=${beReplied.user.userId}`">{{ beReplied.user.nickname }}</a>
                    ：{{ beReplied.content }}
                </div>
                <div class="comment-item-opt">
                    <span class="comment-opt-date">{{ format(item.time) }}</span>
                    <span v-if="item.likedCount > 0" class="comment-opt-liked">
                        <mm-icon type="good"></mm-icon>
                        {{ item.likedCount }}
                    </span>
                </div>
            </dd>
        </dl>
    </div>
</template>

<script setup>
import { getComment } from '@/api/index';
import mmLoading from '@/base/mm-loading/mm-loading.vue';
import { loadMixin } from '@/utils/mixin';
import { addZero } from '@/utils/util'

// 复用混入的使用方式
let { mmLoadShow, _hideLoad } = loadMixin();
let { proxy } = getCurrentInstance();
let data = reactive({
    lockUp: true, // 是否锁定滚动加载事件，默认锁定
    page: 0, // 分页
    hotComments: [], // 精彩评论
    commentList: [], // 最新评论
    total: null // 评论总数
})

// 初始化，create的时候调用获取评论
let initData = function () {
    getComment(proxy.$route.params.id, data.page).then(res => {
        data.hotComments = res.hotComments;
        data.commentList = res.comments;
        data.total = res.total;
        data.lockUp = true;
        _hideLoad();
        console.log(data.hotComments);
        console.log(data.commentList);
        console.log(data.total);
    })
}

// 格式化方法
const format = function (time) {
    let formatTime = null;
    const date = new Date(time);
    const dateObj = {
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate(),
        hours: date.getHours(),
        minutes: date.getMinutes()
    }
    const newTime = new Date();
    const diff = newTime.getTime() - time;
    if (newTime.getDate() === dateObj.date && diff < 60000) {
        formatTime = '刚刚';
    } else if (newTime.getDate() === dateObj.date && diff > 60000 && diff < 3600000) {
        formatTime = `${Math.floor(diff / 60000)}分钟前`;
    } else if (newTime.getDate() === dateObj.date && diff < 3600000 && diff < 86400000) {
        formatTime = `${addZero(dateObj.hours)}:${addZero(dateObj.minutes)}`;
    } else if (newTime.getDate() !== dateObj.date && diff < 86400000) {
        formatTime = `昨天${addZero(dateObj.hours)}:${addZero(dateObj.minutes)}`;
    } else if (newTime.getFullYear() === dateObj.year) {
        formatTime = `${dateObj.month + 1}月${dateObj.date}日`;
    } else {
        formatTime = `${dateObj.year}年${dateObj.month + 1}月${dateObj.date}日`
    }
    return formatTime;
}

// created
initData();
</script>

<style lang="scss" scoped>
.comment {
    position: relative;
    transform: translate3d(0, 0, 0);
    width: 100%;
    height: 100%;
    overflow: hidden;
    .comment-list {
        height: 100%;
        padding: 0 10px;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        .comment-title {
            height: 34px;
            line-height: 34px;
            padding: 10px 0;
            color: $text_color_active;
            border-bottom: 1px solid $comment_head_line_color;
        }
        .comment-item {
            position: relative;
            padding: 15px 0 15px 55px;
            border-bottom: 1px solid $comment_item_line_color;
            .comment-item-pic {
                display: block;
                position: absolute;
                left: 0;
                top: 20px;
                width: 38px;
                height: 38px;
                border-radius: 50%;
                overflow: hidden;
            }
            .comment-item-title {
                height: 20px;
                margin-bottom: 6px;
                font-weight: 400;
                @include no-wrap();
                color: $text_color_active;
            }
            .comment-item-disc {
                overflow: hidden;
                word-break: break-all;
                word-wrap: break-word;
                line-height: 25px;
                text-align: justify;
                color: $text_color;
                img {
                    position: relative;
                    vertical-align: middle;
                    top: -2px;
                }
            }
            .comment-item-replied {
                padding: 8px 19px;
                margin-top: 10px;
                line-height: 20px;
                border: 1px solid $comment_replied_line_color;
                a {
                    color: $text_color_active;
                }
            }
            .comment-item-opt {
                margin-top: 10px;
                line-height: 25px;
                text-align: right;
                overflow: hidden;
                .comment-opt-date {
                    float: left;
                    line-height: 28px;
                }
                .comment-opt-liked {
                    display: inline-block;
                    height: 20px;
                    line-height: 20px;
                }
            }
        }
    }
}
</style>