<template>
    <!-- 排行榜 -->
    <div class="topList">
        <mm-loading v-model:value="mmLoadShow"></mm-loading>
        这是排行榜
    </div>
</template>

<script setup>
import { getToplistDetail, getPersonalized } from '@/api/index'
import MmLoading from '@/base/mm-loading/mm-loading.vue'
import { loadMixin } from '@/utils/mixin'
// 复用混入的使用方式
let { mmLoadShow, _hideLoad } = loadMixin();

_hideLoad();
</script>