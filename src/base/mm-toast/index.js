// 全局组件
import TempToast from './mm-toast.vue';
import { createApp } from 'vue';

let instance;
let showToast = false;
let time // 存储toast 显示状态
let dom
const mmToast = {
	install (app, options = {}) {
		app.config.globalProperties.$mmToast = ((message, position) => {
			// 防抖优化
			if (showToast) {
				clearTimeout(time);
				instance.data.visible = showToast = false;
				document.body.removeChild(dom);
			}
			// 1. 实例化并绑定组件
			let tempToast = createApp(TempToast);
			dom = document.createElement('div')
			instance = tempToast.mount(dom);
			// 2. 获取组件的默认配置
			let opt = instance.data;
			Object.assign(opt, options);
			// 3. 挂载的node添加到body中
			document.body.appendChild(dom);
			
			// 4. 添加配置
			if (message) {
				opt.message = message;
			}
			if (position) {
				opt.position = position;
			}
			// 5. 显示
			opt.visible = showToast = true;

			time = setTimeout(function() {
				opt.visible = showToast = false;
				try {
					document.body.removeChild(dom);
				} catch (error) {
					console.log(error);
				}
			}, opt.duration) 
		})
	}
}
export default mmToast