<script setup lang="ts">
import { useLichessAuthStore } from './stores/auth'

const auth = useLichessAuthStore()

onMounted(() => {
	 auth.init()
})
</script>

<template>
	<UApp>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	</UApp>
</template>
