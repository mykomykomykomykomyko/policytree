<template>
  <div class="space-y-6">
    <header class="bg-white shadow">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">Documents</h1>
          <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <PlusIcon class="h-5 w-5 mr-2" />
            Upload Document
          </button>
        </div>
      </div>
    </header>

    <!-- Search and Filters -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex space-x-4">
        <div class="flex-1">
          <label for="search" class="sr-only">Search documents</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              class="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Search documents..."
            >
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <select
            v-model="selectedType"
            class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
          >
            <option value="">All Types</option>
            <option>Policy</option>
            <option>Procedure</option>
            <option>Guidelines</option>
          </select>
          <select
            v-model="sortBy"
            class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
          >
            <option value="name">Name</option>
            <option value="date">Date</option>
            <option value="type">Type</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Documents Table -->
    <div class="bg-white shadow rounded-lg">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Modified</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Size</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="document in filteredDocuments" :key="document.id" class="hover:bg-gray-50">
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div class="flex items-center">
                  <DocumentIcon class="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div class="font-medium text-gray-900">{{ document.name }}</div>
                    <div class="text-gray-500">{{ document.description }}</div>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ document.type }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ document.modified }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ document.size }}</td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button class="text-primary-600 hover:text-primary-900 mr-4">Edit</button>
                <button class="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { DocumentIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const searchQuery = ref('')
const selectedType = ref('')
const sortBy = ref('name')

const documents = ref([
  {
    id: 1,
    name: 'Employee Handbook 2024',
    description: 'Complete guide for employee policies and procedures',
    type: 'Policy',
    modified: '2024-03-10',
    size: '2.4 MB'
  },
  {
    id: 2,
    name: 'Security Guidelines',
    description: 'IT security protocols and best practices',
    type: 'Guidelines',
    modified: '2024-03-08',
    size: '1.8 MB'
  },
  {
    id: 3,
    name: 'Remote Work Policy',
    description: 'Guidelines for remote work arrangements',
    type: 'Policy',
    modified: '2024-03-05',
    size: '956 KB'
  }
])

const filteredDocuments = computed(() => {
  let filtered = documents.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(doc => 
      doc.name.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query)
    )
  }

  if (selectedType.value) {
    filtered = filtered.filter(doc => doc.type === selectedType.value)
  }

  return filtered.sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sortBy.value === 'date') {
      return new Date(b.modified) - new Date(a.modified)
    } else {
      return a.type.localeCompare(b.type)
    }
  })
})
</script> 