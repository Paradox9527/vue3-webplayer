import { defineStore } from "pinia";
import { setUserId, getUserId } from "@/utils/storage.js"

export const useUserStore = defineStore(
	'user',
	{
		state: () => {
			return {
				uid: getUserId() || null
			}
		},
		getters: {
			getUid() {
				return this.uid;
			}
		},

		actions: {
			saveUserId(uid) {
				this.uid = uid;
				setUserId(uid);
			}
		}
	}
)