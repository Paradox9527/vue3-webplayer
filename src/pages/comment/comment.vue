<template>
    <div class="comment">
        <mmLoading v-model:value="mmLoadShow"></mmLoading>
    </div>
</template>

<script setup>
import { getComment } from '@/api/index';
import mmLoading from '@/base/mm-loading/mm-loading.vue';
import { loadMixin } from '@/utils/mixin'

let { mmLoadShow, _hideLoad } = loadMixin();

let initData = function () {
    getComment('2026224214', 1).then(res => {
        _hideLoad();
    })
}
initData();
</script>

<style lang="scss" scoped>
.comment {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>