<template>
  <div class="space-y-6">
    <header class="bg-gray-800/50 backdrop-blur-sm shadow">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
      </div>
    </header>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div 
        v-for="stat in stats" 
        :key="stat.name" 
        class="bg-gray-800/50 backdrop-blur-sm overflow-hidden shadow rounded-lg hover:bg-gray-800/60 transition-all duration-200"
      >
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <component :is="stat.icon" class="h-6 w-6 text-primary-400" aria-hidden="true" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-300 truncate">{{ stat.name }}</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-white">{{ stat.value }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-gray-800/50 backdrop-blur-sm shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-white">Recent Activity</h3>
        <div class="mt-6 flow-root">
          <ul role="list" class="-my-5 divide-y divide-gray-700">
            <li 
              v-for="activity in recentActivity" 
              :key="activity.id" 
              class="py-5 hover:bg-gray-800/30 px-4 -mx-4 rounded-lg transition-all duration-200"
            >
              <div class="relative focus-within:ring-2 focus-within:ring-primary-500">
                <h3 class="text-sm font-semibold text-gray-100">
                  <a href="#" class="hover:text-primary-400 focus:outline-none transition-colors">
                    {{ activity.title }}
                  </a>
                </h3>
                <p class="mt-1 text-sm text-gray-400 line-clamp-2">{{ activity.description }}</p>
                <time class="mt-2 text-xs text-gray-500">{{ activity.date }}</time>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DocumentTextIcon, ChatBubbleLeftIcon, ShareIcon, UserGroupIcon } from '@heroicons/vue/24/outline'

const stats = ref([
  { name: 'Total Documents', value: '148', icon: DocumentTextIcon },
  { name: 'Active Chats', value: '12', icon: ChatBubbleLeftIcon },
  { name: 'Shared Policies', value: '24', icon: ShareIcon },
  { name: 'Team Members', value: '8', icon: UserGroupIcon },
])

const recentActivity = ref([
  {
    id: 1,
    title: 'Privacy Policy Updated',
    description: 'The company privacy policy has been updated to reflect new data protection regulations.',
    date: '1 hour ago'
  },
  {
    id: 2,
    title: 'New Team Member Added',
    description: 'Sarah Johnson has been added to the policy management team.',
    date: '3 hours ago'
  },
  {
    id: 3,
    title: 'Document Shared',
    description: 'Terms of Service document has been shared with the legal team for review.',
    date: '5 hours ago'
  }
])
</script> 