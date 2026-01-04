<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

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
</script>

<template>
  
  <UHeader>
	<template #title>
			<h1> ETHCHESS</h1>
	</template>
    <template #right>
			<button>Join us</button>
    </template>

    <UNavigationMenu :items="items" />

  </UHeader>
</template>

