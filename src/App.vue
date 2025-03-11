<template>
  <div class="min-h-screen">
    <nav class="bg-white/10 backdrop-blur-sm shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-2xl font-bold text-white">
                PolicyTree
              </router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-white"
                :class="{ 'border-b-2 border-primary-200': $route.path === item.href }"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary-400">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view></router-view>
    </main>

    <footer class="bg-white/5 backdrop-blur-sm border-t border-white/10 mt-auto">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-200">
          © {{ new Date().getFullYear() }} PolicyTree. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Documents', href: '/documents' },
  { name: 'Knowledge Graph', href: '/graph' },
]
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(
    -45deg,
    #1a1a2e 0%,
    #2c365e 20%,
    #444b8c 40%,
    #4b3f72 50%,
    #3d5a80 60%,
    #48466d 70%,
    #3d315b 80%,
    #1a1a2e 100%
  );
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 50% 100%;
  }
  50% {
    background-position: 100% 50%;
  }
  75% {
    background-position: 50% 0%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style> 