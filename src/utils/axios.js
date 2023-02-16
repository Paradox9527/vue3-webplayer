import axios from "axios";
import { createApp } from "vue";
import mmToast from '../base/mm-toast';
const app = createApp({})
app.use(mmToast)
const request = axios.create({
	baseURL: import.meta.env.VUE_APP_BASE_API_URL,
});
request.interceptors.response.use(
	(response) => {
		window.response = response;	
		if (response.status === 200 && response.data.code === 200) {
	    	return response.data;
	  	}
	  	return Promise.reject(response);
	},
	(error) => {
		app.config.globalProperties.$mmToast(
			error.response ? error.response.data.message : error.message
		)
	  	return error;
	}
);

export default request;
