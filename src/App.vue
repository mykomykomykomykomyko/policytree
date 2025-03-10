<template>
  <div class="min-h-screen">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-2xl font-bold text-primary-600">
                PolicyTree
              </router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                :class="{ 'border-b-2 border-primary-500': $route.path === item.href }"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <button class="btn-primary">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view></router-view>
    </main>

    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500">
          © {{ new Date().getFullYear() }} PolicyTree. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Documents', href: '/documents' },
  { name: 'Knowledge Graph', href: '/graph' },
  { name: 'Chat', href: '/chat' },
]
</script> 