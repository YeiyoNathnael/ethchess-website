# Understanding State Management in Your EthChess App

This document explains everything about how state management works in your application, why the authentication wasn't working, and how we fixed it.

---

## Table of Contents

1. [What is State?](#what-is-state)
2. [The Problem with Regular Variables](#the-problem-with-regular-variables)
3. [Vue's Reactivity System](#vues-reactivity-system)
4. [What is Pinia?](#what-is-pinia)
5. [What is useState in Nuxt?](#what-is-usestate-in-nuxt)
6. [What Went Wrong in Your Code](#what-went-wrong-in-your-code)
7. [How We Fixed It](#how-we-fixed-it)
8. [The Complete Flow](#the-complete-flow)

---

## What is State?

**State** is just a fancy word for "data that can change over time and that your app needs to remember."

Think of it like this:
- Your app is like a person
- State is their memory
- When the user logs in, the app needs to "remember" who they are

Examples of state in your app:
- Whether the user is logged in (`isAuthenticated`)
- Who the user is (`me` - contains username, id, etc.)
- The user's OAuth tokens (stored in `LichessAuth`)

```
State = Data that:
  1. Changes over time
  2. Needs to be shared across components
  3. Should trigger UI updates when it changes
```

---

## The Problem with Regular Variables

In JavaScript, if you do this:

```typescript
let isLoggedIn = false;

function login() {
  isLoggedIn = true;  // This changes...
}
```

The problem is: **Vue has no idea this variable changed**. Your UI won't update.

Vue components render once and won't magically know to re-render when a random variable somewhere changes. Vue needs a way to "watch" for changes.

---

## Vue's Reactivity System

Vue solves this with **reactive primitives**. The main ones are:

### `ref()` - For single values

```typescript
import { ref } from 'vue'

const count = ref(0)      // Create a reactive reference
count.value = 5           // Access/modify with .value
```

When you change `count.value`, Vue knows about it and updates any component using `count`.

### `computed()` - For derived values

```typescript
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

// This automatically updates when firstName or lastName changes
const fullName = computed(() => firstName.value + ' ' + lastName.value)
```

### `reactive()` - For objects

```typescript
import { reactive } from 'vue'

const user = reactive({
  name: 'John',
  age: 25
})

user.age = 26  // Vue tracks this change (no .value needed)
```

### The Key Insight

```
Regular variable:  Changes happen in silence. Vue is blind.
Reactive ref:      Vue is watching. Changes trigger updates.
```

---

## What is Pinia?

**Pinia** is a state management library for Vue. Think of it as a "global memory" for your entire app.

### Why do we need it?

Imagine this component tree:

```
App.vue
├── Nav.vue          (needs to know if user is logged in)
├── Layout.vue
│   ├── Sidebar.vue  (needs to show user's name)
│   └── Page.vue
│       └── Profile.vue  (needs user data)
```

Without Pinia, you'd have to pass the user data from App → Layout → Page → Profile. This is called "prop drilling" and it's a nightmare.

With Pinia, any component can directly access the shared state:

```typescript
// Any component, anywhere
const auth = useAuthStore()
console.log(auth.isAuthenticated)  // Just works!
```

### Anatomy of a Pinia Store

There are two ways to define a store:

#### Option 1: Options Syntax (what you tried to use)

```typescript
export const useAuthStore = defineStore('auth', {
  // State: the reactive data
  state: () => ({
    user: null,
    isLoggedIn: false
  }),
  
  // Getters: computed properties derived from state
  getters: {
    username: (state) => state.user?.name ?? 'Guest'
  },
  
  // Actions: methods that can modify state
  actions: {
    login(userData) {
      this.user = userData
      this.isLoggedIn = true
    }
  }
})
```

#### Option 2: Setup Syntax (what we're using)

```typescript
export const useAuthStore = defineStore('auth', () => {
  // State: just use ref()
  const user = ref(null)
  const isLoggedIn = ref(false)
  
  // Getters: just use computed()
  const username = computed(() => user.value?.name ?? 'Guest')
  
  // Actions: just regular functions
  function login(userData) {
    user.value = userData
    isLoggedIn.value = true
  }
  
  // Return everything you want to expose
  return { user, isLoggedIn, username, login }
})
```

### Your Original Broken Code

```typescript
export const useAuthStore = defineStore('auth', () => {
  const { me, login, logout } = useLichessAuth()
  
  // ❌ THIS IS WRONG - This is options syntax inside setup syntax!
  state: () => {
    return { me, login, logout, isAuthenticated: computed(() => !!me.value) }
  }
})
```

What's happening here:
1. You're using setup syntax (the function `() => { ... }`)
2. But inside, you wrote `state: () => { ... }` which is options syntax
3. In JavaScript, `state:` is just a **label** (like for loops), not a property
4. The function after it executes but the result goes nowhere
5. Nothing is returned from the store, so it's empty!

### The Fixed Code

```typescript
export const useAuthStore = defineStore('auth', () => {
  const { auth, me, init, login, logout } = useLichessAuth()

  // Getters (computed properties)
  const isAuthenticated = computed(() => !!me.value)
  const user = computed(() => me.value)

  // Return everything
  return {
    auth,
    me,
    isAuthenticated,
    user,
    init,
    login,
    logout,
  }
})
```

---

## What is useState in Nuxt?

Nuxt runs on both the **server** and the **client** (browser). This is called SSR (Server-Side Rendering).

### The SSR Problem

```typescript
// This is DANGEROUS in Nuxt:
const me = ref(null)  // Created at module level (outside function)

export function useLichessAuth() {
  // ...
}
```

Why? Because:

1. **On the server:** This ref is created once and shared across ALL users
2. If User A logs in, `me` gets set to User A's data
3. User B visits the site, and the server still has User A's data in `me`!
4. This is called "state pollution" or "cross-request state contamination"

### How useState Solves This

```typescript
export function useLichessAuth() {
  // useState is SSR-safe - each request gets its own state
  const me = useState<Me | null>('lichess-me', () => null)
  //                              ↑ unique key    ↑ initial value
}
```

`useState` does several things:
1. Creates state that's isolated per-request on the server
2. Automatically transfers state from server to client (hydration)
3. Uses the same state across all components (like a mini-store)

### The Key Difference

```
ref() at module level:
  - Server: Shared across all requests (DANGEROUS!)
  - Client: Works fine, but doesn't hydrate from server

useState():
  - Server: Isolated per request (SAFE!)
  - Client: Hydrates from server, shared across components
```

---

## What Went Wrong in Your Code

Let's trace through all the bugs:

### Bug 1: Store syntax mixup

```typescript
// Your code
export const useAuthStore = defineStore('auth', () => {
  state: () => { return { ... } }  // This does nothing!
})

// JavaScript sees this as:
export const useAuthStore = defineStore('auth', () => {
  state:                           // A label called "state"
  () => { return { ... } }         // An arrow function that's never called
                                   // and its result is discarded
})
```

### Bug 2: Non-reactive me property

```typescript
// In LichessAuth class
class LichessAuth {
  me?: Me;  // This is a plain JavaScript property
  
  authenticate = async () => {
    this.me = { ... }  // Vue can't see this change!
  }
}
```

Then in your composable:

```typescript
export function useLichessAuth() {
  return {
    me: computed(() => authInstance?.me)  // Reads the value...
  }
}
```

The problem: `computed()` runs once, reads `authInstance.me` (which is `undefined`), and Vue has no way to know when `authInstance.me` changes because it's not reactive.

### Bug 3: init() was never called

The `LichessAuth` class has an `init()` method that:
1. Checks if returning from OAuth (has authorization code in URL)
2. Exchanges the code for an access token
3. Fetches the user's profile

But nobody was calling it! After you log in with Lichess and get redirected back, the OAuth flow never completed.

### Bug 4: Module-level ref with SSR

```typescript
// At the top of the file (module level)
const me = ref<Me | null>(null)  // Shared across requests on server!

export function useLichessAuth() {
  // Uses the shared ref...
}
```

---

## How We Fixed It

### Fix 1: Correct store syntax

```typescript
export const useAuthStore = defineStore('auth', () => {
  const { auth, me, init, login, logout } = useLichessAuth()
  
  const isAuthenticated = computed(() => !!me.value)
  const user = computed(() => me.value)
  
  // Actually return the state, getters, and actions
  return {
    auth,
    me,
    isAuthenticated,
    user,
    init,
    login,
    logout,
  }
})
```

### Fix 2: Create our own reactive state

Instead of relying on the non-reactive `me` property in `LichessAuth`, we created our own reactive state:

```typescript
export function useLichessAuth() {
  // SSR-safe reactive state
  const me = useState<Me | null>('lichess-me', () => null)
  
  const init = async () => {
    await authInstance.init()
    // Copy the value into our reactive state
    me.value = authInstance.me ?? null
  }
}
```

Now when `authInstance.me` gets set, we immediately copy it to our reactive `me`, which Vue can track.

### Fix 3: Call init() on app mount

```vue
<!-- app.vue -->
<script setup lang="ts">
const auth = useAuthStore()

onMounted(() => {
  auth.init()  // Now the OAuth callback gets processed!
})
</script>
```

### Fix 4: Use useState instead of module-level ref

```typescript
// Before (dangerous):
const me = ref<Me | null>(null)  // Shared across all server requests

// After (safe):
export function useLichessAuth() {
  const me = useState<Me | null>('lichess-me', () => null)  // Per-request
}
```

### Fix 5: Use storeToRefs in components

```vue
<script setup>
import { storeToRefs } from 'pinia'

const auth = useAuthStore()

// ❌ This loses reactivity:
const isAuthenticated = auth.isAuthenticated

// ✅ This preserves reactivity:
const { isAuthenticated, me } = storeToRefs(auth)

// Actions don't need storeToRefs:
const { login, logout } = auth
</script>
```

Why? When you destructure a store directly, you get the current values, not the reactive references. `storeToRefs` extracts the refs properly so they stay reactive.

---

## The Complete Flow

Here's what happens now when a user logs in:

### Step 1: User clicks "Login"

```
Nav.vue: <UButton @click="login">Login</UButton>
                        ↓
auth.login()  (from store)
                        ↓
useLichessAuth().login()  (from composable)
                        ↓
authInstance.login()  (from LichessAuth class)
                        ↓
oauth.fetchAuthorizationCode()  (redirects to Lichess)
```

### Step 2: User logs in on Lichess, gets redirected back

```
URL: http://localhost:3000/?code=abc123&state=xyz
```

### Step 3: App mounts, init() is called

```
app.vue: onMounted(() => auth.init())
                        ↓
useAuthStore().init()
                        ↓
useLichessAuth().init()
                        ↓
authInstance.init()
  ├── oauth.isReturningFromAuthServer() → true
  ├── oauth.getAccessToken() → exchanges code for token
  └── authenticate() → fetches /api/account, sets this.me
                        ↓
me.value = authInstance.me  (copies to reactive state)
```

### Step 4: UI updates

```
me.value changed
        ↓
isAuthenticated = computed(() => !!me.value)  → now returns true
        ↓
Vue detects the change
        ↓
Nav.vue re-renders
        ↓
v-if="!isAuthenticated" → false, so Login button hides
v-else → shows "Join us" and "Logout" buttons
```

---

## Summary

| Concept | What it is | When to use it |
|---------|-----------|----------------|
| `ref()` | Makes a single value reactive | Local component state |
| `computed()` | Derives value from other reactive values | When you need a value based on other state |
| `reactive()` | Makes an object reactive | When you have an object with multiple properties |
| Pinia Store | Global reactive state container | When state needs to be shared across components |
| `useState()` | Nuxt's SSR-safe state | When using Nuxt and need shared state |
| `storeToRefs()` | Extracts refs from store | When destructuring state/getters from a Pinia store |

---

## Key Takeaways

1. **Vue needs reactivity** - Regular JS variables don't trigger UI updates
2. **Return from setup stores** - Anything not returned doesn't exist
3. **SSR is tricky** - Module-level state is shared on the server
4. **Initialize on mount** - OAuth callbacks need processing
5. **Bridge non-reactive code** - Copy values to reactive refs when working with non-Vue classes
6. **Use storeToRefs** - When destructuring state from Pinia stores

Your authentication now works because:
- ✅ Store correctly returns all state, getters, and actions
- ✅ `me` is stored in SSR-safe `useState`
- ✅ `init()` is called on app mount to process OAuth callback
- ✅ Nav.vue uses `storeToRefs` to maintain reactivity
