<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { storeToRefs } from 'pinia'
import { useLichessAuthStore } from '../../stores/auth'

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Dashboard',class: 'text-2xl'

  },
  {
    label: 'Tournaments',class: 'text-2xl'

  },
  {
    label: 'Leaderboard',class: 'text-2xl'

  },
  {
    label: 'Profile',
    class: 'text-2xl'
  }

])

const auth = useLichessAuthStore()
const { isAuthC, username, loading } = storeToRefs(auth)
const { login, logout } = auth


</script>

<template>
  
  <UHeader>
	<template #title>
			<h1> ETHCHESS</h1>
	</template>
    <template #right>
			<template v-if="loading">
				<UButton disabled class="mr-2">
					<UIcon name="tabler:loader-2" class="animate-spin" />
				</UButton>
			</template>
			<UButton  v-else-if="!isAuthC" class = 'mr-2' @click="login"><span>Login</span></UButton>
			<template v-else>
				<UButton class="mr-2">{{ username}}</UButton>
				<UButton variant="ghost" @click="logout">Logout</UButton>
			</template>
    </template>

    <UNavigationMenu :items="items" />

  </UHeader>
</template>

