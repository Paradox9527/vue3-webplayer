<template>
	<transition name="mm-dialog-fade">
		<div v-show="dialogShow" class="mm-dialog-box">
			<div class="mm-dialog-wrapper">
				<div class="mm-dialog-content">
					<div class="mm-dialog-head" v-text="headText"></div>
					<slot>
						<div class="mm-dialog-text" v-html="bodyText"></div>
					</slot>
					<!-- <div class="mm-dialog-text">我是文本</div> -->
					<div class="mm-dialog-btns">
						<div v-if="dialogType !== 'alert'"
							class="mm-btn-cancel" v-text="cancelBtnText" @click="cancel"></div>
						<slot name="btn"></slot>
						<div class="mm-btn-confirm" v-text="confirmBtnText" @click="confirm"></div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup>
const emit = defineEmits(['cancel', 'confirm']);
let dialogShow = ref(false);
const { proxy } = getCurrentInstance();

// 计算属性
const dialogType = computed(() => {
	return props.type.toLowerCase();
})

// 自定义属性props
const props = defineProps({
	type: {
		type: String,
		default: 'confirm'
	},
	// 对话框文本
	headText: {
		type: String,
		default: ''
	},
	// 内容文本（可以是html）
    bodyText: {
      type: String,
      default: ''
    },
	// 取消按钮文本
    cancelBtnText: {
      type: String,
      default: '取消'
    },
    // 确定按钮文本
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    // Dialog 是否插入至 body 元素下
    appendToBody: {
      type: Boolean,
      default: true
    }
})

// 侦听器 watch 
watch(dialogShow, (value) => {
	if (value && props.appendToBody) {
		// console.log("添加");
		document.body.appendChild(proxy.$el);
	}
})

// method
const show = function () {
	dialogShow.value = true;
}
const hide = function () {
	dialogShow.value = false;
}
const cancel = function () {
	hide();
	emit("cancel");
}
const confirm = function () {
	hide();
	emit("confirm")
}

// 生命周期钩子函数
onMounted(() => {
	if (dialogShow.value && appendToBody.value) {
		document.body.appendChild(proxy.$el)
	}	
})

onUnmounted(() => {
	if (proxy.appendToBody && proxy.$el && proxy.$el.parentNode) {
		// console.log("销毁");
		proxy.$el.parentNode.removeChild(proxy.$el);
	}
})

// 暴露方法或者属性
defineExpose({
	show,
	hide
})
</script>

<style lang="scss">
$dialog-prefix-cls: mm-dialog;

.mm-dialog-box {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 1996;
	background-color: $dialog_bg_color;
	user-select: none;
	&.mm-dialog-fade-enter-active {
		animation: mm-dialog-fadein 0.3s;
		.#{$dialog-prefix-cls}-content {
			animation: mm-dialog-zoom 0.3s;
		}
	}
	.#{$dialog-prefix-cls}-wrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
    	z-index: 1996;
		.mm-dialog-content {
			width: 420px;
			border-radius: 5px;
			background: $dialog_content_bg_color;
			@media (max-width: 767px) {
				width: 270px;
				border-radius: 10px;
				text-align: center;
			}
			.mm-dialog-head {
				padding: 15px;
        		padding-bottom: 0;
        		font-size: $font_size_large;
        		color: $text_color_active;
			}
			.mm-dialog-text {
				padding: 20px 15px;
				line-height: 22px;
				font-size: $font_size_medium;
        		color: $dialog_text_color;
			}
			.mm-dialog-btns {
				display: flex;
				align-items: center;
				padding: 0 15px 10px;
				text-align: center;
				color: $dialog_text_color;
				@media (min-width: 768px) {
					justify-content: flex-end;
					div {
						display: block;
						padding: 8px 15px;
						border-radius: 3px;
						border: 1px solid $btn_color;
						font-size: $font_size_medium;
            			cursor: pointer;
						&:not(:nth-of-type(1)) {
							margin-left: 10px;
						}
						&.mm-btn-confirm {
							border-style: $btn_color_active;
						}
						&:hover {
							color: $text_color_active;
							border: 1px solid $btn_color_active;
						}
					}
				}
				@media (max-width: 767px) {
					& {
						padding: 0;
						justify-content: center;
						div {
							flex: 1;
							line-height: 22px;
							padding: 10px 0;
							border-top: 1px solid $dialog_line_color;
							font-size: $font_size_large;
							&:not(:nth-of-type(1)) {
								border-left: 1px solid $dialog_line_color;
							}
						}
					}
				}
			}
		}
	}
}

@keyframes mm-dialog-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes mm-dialog-zoom {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>