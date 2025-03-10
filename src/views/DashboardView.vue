<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <button class="btn-primary">
        Upload Document
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Recent Documents Card -->
      <div class="card">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Documents</h2>
        <div class="space-y-4">
          <div v-for="doc in recentDocuments" :key="doc.id" class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <DocumentIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ doc.title }}</p>
                <p class="text-xs text-gray-500">{{ doc.date }}</p>
              </div>
            </div>
            <button class="text-primary-600 hover:text-primary-700">
              View
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Actions Card -->
      <div class="card">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div class="space-y-3">
          <button class="w-full btn-secondary flex items-center justify-center space-x-2">
            <ChartBarIcon class="h-5 w-5" />
            <span>View Knowledge Graph</span>
          </button>
          <button class="w-full btn-secondary flex items-center justify-center space-x-2">
            <ChatBubbleLeftIcon class="h-5 w-5" />
            <span>Open Chat</span>
          </button>
          <button class="w-full btn-secondary flex items-center justify-center space-x-2">
            <MagnifyingGlassIcon class="h-5 w-5" />
            <span>Search Policies</span>
          </button>
        </div>
      </div>

      <!-- Insights Card -->
      <div class="card">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Policy Insights</h2>
        <div class="space-y-4">
          <div v-for="insight in insights" :key="insight.id" class="border-l-4 border-primary-500 pl-4">
            <p class="text-sm text-gray-900">{{ insight.text }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ insight.source }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DocumentIcon, ChartBarIcon, ChatBubbleLeftIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const recentDocuments = [
  { id: 1, title: 'HR Policy 2023', date: '2023-08-15' },
  { id: 2, title: 'Security Guidelines', date: '2023-08-14' },
  { id: 3, title: 'Code of Conduct', date: '2023-08-13' },
]

const insights = [
  {
    id: 1,
    text: 'Updated compliance requirements for remote work policies',
    source: 'HR Policy 2023'
  },
  {
    id: 2,
    text: 'New security protocols for data handling',
    source: 'Security Guidelines'
  },
  {
    id: 3,
    text: 'Revised ethical guidelines for employee conduct',
    source: 'Code of Conduct'
  }
]
</script> 