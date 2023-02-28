import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd())
	// console.log(env);
	return {
		base: './',
		plugins: [vue(), AutoImport({
			imports:[
				'vue',
				'vue-router',
				'pinia'
			],
			dts: false
		  })],
		  resolve: {
			alias: {
			  '@': path.resolve(__dirname, './src'),
			  'assets':path.resolve(__dirname, 'src/assets')
			}
		  },
		  css: {
			preprocessorOptions: {
				scss: {
					additionalData:"@import 'src/styles/var.scss'; @import 'src/styles/mixin.scss';"
				}
			}
		  }
	}
})
