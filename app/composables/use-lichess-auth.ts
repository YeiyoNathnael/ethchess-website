import { LichessAuth } from '../services/auth'


export function useLichessAuth() {

	const authInstance = new LichessAuth()

	return authInstance
}
