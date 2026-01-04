
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const about: NavigationMenuItem[] = [
  {
    label: 'Figma Kit',
    to: 'https://go.nuxt.com/figma-ui',
    target: '_blank'
  },
  {
    label: 'Playground',
    to: 'https://stackblitz.com/edit/nuxt-ui',
    target: '_blank'
  },
  {
    label: 'Releases',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  },
]
const getinvolved: NavigationMenuItem[] = [
  {
    label: 'Figma Kit',
    to: 'https://go.nuxt.com/figma-ui',
    target: '_blank'
  },
  {
    label: 'Playground',
    to: 'https://stackblitz.com/edit/nuxt-ui',
    target: '_blank'
  },
  {
    label: 'Releases',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  },
]
const chesscommunity: NavigationMenuItem[] = [
  {
    label: 'Figma Kit',
    to: 'https://go.nuxt.com/figma-ui',
    target: '_blank'
  },
  {
    label: 'Playground',
    to: 'https://stackblitz.com/edit/nuxt-ui',
    target: '_blank'
  },
  {
    label: 'Releases',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  },
]
</script>

<template>
  <UFooter>
    <template #left>
	<div>
      <h1>ETHCHESS</h1>
      <p> Connecting chess players, tournaments, and community across Ethiopia, one move at a time.</p>
	 <UButton
        icon="tabler:brand-instagram"
        color="neutral"
        variant="ghost"
        target="_blank"
        aria-label="Instagram"
      />
      <UButton
        icon="i-simple-icons-x"
        color="neutral"
        variant="ghost"
        target="_blank"
        aria-label="X"
      />
      <UButton
        icon="tabler:brand-youtube-filled"
        color="neutral"
        variant="ghost"
        to="https://www.youtube.com/@ETHCHESS-"
        target="_blank"
        aria-label="YouTube"
      />

      <p class="text-muted text-sm">Copyright © {{ new Date().getFullYear() }}</p>
	</div>
    </template>


    <template #right>

	    <div>
    <h1>About</h1>
    <UNavigationMenu :items="about" orientation="vertical" variant="link" />
    </div> 
    <div>
    <h1>Get Involved</h1>
    <UNavigationMenu :items="getinvolved" orientation="vertical" variant="link" />
    </div>
    <div>
    <h1>Chess Community</h1>
    <UNavigationMenu :items="chesscommunity" orientation="vertical" variant="link" />
    </div>


    </template>
    </UFooter>
</template>
