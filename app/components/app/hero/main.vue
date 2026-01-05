<script setup lang="ts">
const links = ref([
  {
    label: 'Join Club Now',
  },
  {
    label: 'Learn more',
    color: 'neutral',
    variant: 'subtle',
    trailingIcon: 'i-lucide-arrow-right'
  }
])
</script>

<template>
  <UPageHero
    headline="Premium Chess Club Experience"
    title="Master Chess With ETHCHESS Club"
    description="Join our elite chess community. Compete in tournaments, climb leaderboards and connect with chess enthusiasts from around the world"
    :links="links"
  />
</template>
