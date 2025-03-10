<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">Documents</h1>
      <button @click="showUploadModal = true" class="btn-primary">
        Upload Document
      </button>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">Upload Document</h2>
          <button @click="showUploadModal = false" class="text-gray-400 hover:text-gray-500">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
          :class="{ 'border-primary-500': isDragging }"
          @dragenter.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <CloudArrowUpIcon class="mx-auto h-12 w-12 text-gray-400" />
          <div class="mt-4">
            <label class="btn-secondary cursor-pointer">
              <span>Select files</span>
              <input type="file" class="hidden" multiple @change="handleFileSelect" />
            </label>
            <p class="mt-2 text-sm text-gray-500">
              or drag and drop
            </p>
            <p class="mt-1 text-xs text-gray-500">
              PDF, Word, PowerPoint, or website links
            </p>
          </div>
        </div>

        <div v-if="uploadProgress > 0" class="mt-4">
          <div class="flex justify-between text-sm text-gray-600 mb-1">
            <span>Uploading...</span>
            <span>{{ uploadProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${uploadProgress}%` }"
            ></div>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button @click="showUploadModal = false" class="btn-secondary">
            Cancel
          </button>
          <button
            @click="uploadFiles"
            class="btn-primary"
            :disabled="!selectedFiles.length || uploadProgress > 0"
          >
            Upload
          </button>
        </div>
      </div>
    </div>

    <!-- Document List -->
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <div class="flex space-x-4">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search documents..."
            class="input-field"
          />
          <select v-model="filterType" class="input-field">
            <option value="">All Types</option>
            <option value="pdf">PDF</option>
            <option value="doc">Word</option>
            <option value="ppt">PowerPoint</option>
            <option value="url">Website</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upload Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="doc in filteredDocuments" :key="doc.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <DocumentIcon class="h-5 w-5 text-gray-400 mr-2" />
                  <div class="text-sm font-medium text-gray-900">{{ doc.title }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-blue-100 text-blue-800': doc.type === 'pdf',
                    'bg-green-100 text-green-800': doc.type === 'doc',
                    'bg-purple-100 text-purple-800': doc.type === 'ppt',
                    'bg-yellow-100 text-yellow-800': doc.type === 'url'
                  }"
                >
                  {{ doc.type.toUpperCase() }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ doc.uploadDate }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': doc.status === 'processed',
                    'bg-yellow-100 text-yellow-800': doc.status === 'processing',
                    'bg-red-100 text-red-800': doc.status === 'error'
                  }"
                >
                  {{ doc.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary-600 hover:text-primary-900 mr-3">View</button>
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
import { DocumentIcon, CloudArrowUpIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const showUploadModal = ref(false)
const isDragging = ref(false)
const selectedFiles = ref([])
const uploadProgress = ref(0)
const searchQuery = ref('')
const filterType = ref('')

const documents = ref([
  {
    id: 1,
    title: 'HR Policy 2023',
    type: 'pdf',
    uploadDate: '2023-08-15',
    status: 'processed'
  },
  {
    id: 2,
    title: 'Security Guidelines',
    type: 'doc',
    uploadDate: '2023-08-14',
    status: 'processing'
  },
  {
    id: 3,
    title: 'Company Website',
    type: 'url',
    uploadDate: '2023-08-13',
    status: 'processed'
  }
])

const filteredDocuments = computed(() => {
  return documents.value.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = !filterType.value || doc.type === filterType.value
    return matchesSearch && matchesType
  })
})

const handleDrop = (e) => {
  isDragging.value = false
  selectedFiles.value = [...e.dataTransfer.files]
}

const handleFileSelect = (e) => {
  selectedFiles.value = [...e.target.files]
}

const uploadFiles = async () => {
  uploadProgress.value = 0
  // Simulate upload progress
  const interval = setInterval(() => {
    if (uploadProgress.value < 100) {
      uploadProgress.value += 10
    } else {
      clearInterval(interval)
      showUploadModal.value = false
      selectedFiles.value = []
      uploadProgress.value = 0
    }
  }, 500)
}
</script> 