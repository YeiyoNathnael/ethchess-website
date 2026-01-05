<script setup lang="ts">
const features = ref([
  {
    title: 'Active Players',
    description: '1,247 (+12%) active players',
    icon: 'i-lucide-users',
  },
  {
    title: 'Tournaments Hosted',
    description: '523 (+8%) tournaments hosted',
    icon: 'i-lucide-trophy',
  },
  {
    title: 'Games Played',
    description: '12,847 (+24%) games played',
    icon: 'i-lucide-trending-up',
  },
  {
    title: 'Active Players',
    description: '1,247 (+12%) active players',
    icon: 'i-lucide-clock',
  }
])
</script>
<template>
  <UPageSection
  title="Growing Chess Community"
    description="Join thousands of chess enthusiasts who are already improving their game with ETHCHESS Club"
   
    :features="features"
  />
</template>
