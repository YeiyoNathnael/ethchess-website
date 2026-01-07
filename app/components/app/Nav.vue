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
const { isAuthC, username } = storeToRefs(auth)
const { login, logout } = auth


</script>

<template>
  
  <UHeader>
	<template #title>
			<h1> ETHCHESS</h1>
	</template>
    <template #right>
			<UButton v-if="!isAuthC" class = 'mr-2' @click="login">Login</UButton>
			<template v-else>
				<UButton class="mr-2">{{ username}}</UButton>
				<UButton variant="ghost" @click="logout">Logout</UButton>
			</template>
    </template>

    <UNavigationMenu :items="items" />

  </UHeader>
</template>

