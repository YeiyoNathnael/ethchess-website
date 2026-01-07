
<script setup lang="ts">

const cards = ref([
  {
    title: 'Tournament System',
    description: 'Participate in weekly tournaments with different time controls and formats. Win the prize and climb the ranks',
    icon: 'i-lucide-trophy',
  },
  {
    title: 'Dynamic Leaderboard',
    description: 'Track your progress with real-time ranking across different categories and time periods',
    icon: 'i-lucide-crown',
  },
  {
    title: 'Active Community',
    description: 'Connect with players worldwide, join discussions, and share your chess knowledge',
    icon: 'i-lucide-users',
  },
  {
    title: 'Secure Platform',
    description: 'Enterprise-grade security with encrypted data and fair play monitoring',
    icon: 'i-lucide-shield',
  },
  {
    title: 'Event Scheduling',
    description: 'Never miss a tournament club event with our smart notification system',
    icon: 'i-lucide-clock',
  },
  {
    title: 'Premium Profile',
    description: 'Showcase your achievements with a customizable premium profile and stats',
    icon: 'i-lucide-star',
  },
  {
    title: 'Lichess Integration',
    description: 'Seamlessly sync with Lichess for game import and advanced analytics',
    icon: 'i-lucide-chess-pawn',
  },
  {
    title: 'Global Reach',
    description: 'Join players from around the world in our international chess community',
    icon: 'i-lucide-globe',
  }
])
</script>

<template>
<UPageHero >
		<template #title>
			<div class='mt-0 mb-0 text-3xl
				'>Everything You Need To Excel</div>
		</template>
		<template #description>
		<p class = 'mb-0'>Our comprehensive platform provides all the tools and features you need to improve your chess game and connect with the community</p>
		</template>
		</UPageHero>
  <UPageGrid>
    <UPageCard
      v-for="(card, index) in cards"
      :key="index"
      v-bind="card"
    />
  </UPageGrid>
</template>

