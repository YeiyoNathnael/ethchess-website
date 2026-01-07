// stores/auth.ts
import { defineStore } from 'pinia'
import { useLichessAuth } from '../composables/use-lichess-auth'
import type { Me } from '../services/auth'


export const useLichessAuthStore = defineStore('lichessAuth', () => {

	const lichessAuthService = useLichessAuth()

	const lichessMe = useState<Me | null>(() => null)

	const isAuthC = computed(() => !!lichessMe.value)

	const username = computed(() => lichessMe.value?.username ?? null)


	async function init() {

		await lichessAuthService.init()
		lichessMe.value = lichessAuthService.me ?? null

	}

	async function login() {

		await lichessAuthService.login()
	}
	async function logout() {

		await lichessAuthService.logout()
		lichessMe.value = null
	}


	return {
		lichessMe,

		isAuthC,
		username,

		init,
		login,
		logout,
	}

})




