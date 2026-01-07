// stores/auth.ts
import { defineStore } from 'pinia'
import { useLichessAuth } from '../composables/use-lichess-auth'
import type { Me } from '../services/auth'


const lichessAuthService = useLichessAuth()
export const useLichessAuthStore = defineStore('lichessAuth', () => {

	const loading = ref(true)
	const lichessMe = useState<Me | null>(() => null)

	const isAuthC = computed(() => !!lichessMe.value)

	const username = computed(() => lichessMe.value?.username ?? null)


	async function init() {
		try {
			await lichessAuthService.init()
			lichessMe.value = lichessAuthService.me ?? null
		} finally {
			loading.value = false
		}
	}

	async function login() {
		loading.value = true
		await lichessAuthService.login()
		loading.value = false
	}
	async function logout() {

		await lichessAuthService.logout()
		lichessMe.value = null
	}


	return {
		lichessMe,
		loading,

		isAuthC,
		username,

		init,
		login,
		logout,
	}

})




