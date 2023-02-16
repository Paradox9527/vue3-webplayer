<template>
	<!-- 暂无数据显示 -->
	<div class="mm-no-result">
		<p class="mm-no-result">{{ title }}</p>
	</div>
</template>

<script setup>
const props = defineProps({
	// 无数据提示文本
	title: {
		type: String,
		default: ""
	}
})
</script>

<style lang="scss">
.mm-no-result {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	&-text {
		margin-top: 30px;
		font-size: $font_size_medium;
		color: $text_color;
	}
}
</style>