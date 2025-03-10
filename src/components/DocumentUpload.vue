<template>
  <div class="space-y-4">
    <!-- Upload Area -->
    <div
      class="relative border-2 border-dashed rounded-lg p-8"
      :class="[
        isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400',
      ]"
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <div class="text-center">
        <CloudArrowUpIcon class="mx-auto h-12 w-12 text-gray-400" />
        <div class="mt-4">
          <label class="relative cursor-pointer">
            <span class="btn-primary">Select files</span>
            <input
              type="file"
              multiple
              class="hidden"
              @change="handleFileSelect"
              accept=".pdf,.doc,.docx,.txt"
            />
          </label>
          <p class="mt-2 text-sm text-gray-500">or drag and drop</p>
        </div>
        <p class="mt-2 text-xs text-gray-500">
          PDF, Word Documents up to 10MB
        </p>
      </div>
    </div>

    <!-- File List -->
    <div v-if="selectedFiles.length > 0" class="bg-white shadow rounded-lg divide-y divide-gray-200">
      <div
        v-for="(file, index) in selectedFiles"
        :key="index"
        class="p-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <DocumentIcon class="h-5 w-5 text-gray-400" />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
          <button
            @click="removeFile(index)"
            class="text-red-600 hover:text-red-900"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
        <div v-if="file.progress !== undefined" class="mt-2">
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>Uploading...</span>
            <span>{{ file.progress }}%</span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full">
            <div
              class="h-2 bg-primary-600 rounded-full transition-all duration-300"
              :style="{ width: `${file.progress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Button -->
    <div v-if="selectedFiles.length > 0" class="flex justify-end">
      <button
        @click="uploadFiles"
        class="btn-primary"
        :disabled="isUploading"
      >
        {{ isUploading ? 'Uploading...' : 'Upload Files' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['upload-complete'])

const isDragging = ref(false)
const selectedFiles = ref([])
const isUploading = ref(false)

const handleDrop = (e) => {
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files)
  addFiles(files)
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  addFiles(files)
}

const addFiles = (files) => {
  // Filter for allowed file types and size
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
  const maxSize = 10 * 1024 * 1024 // 10MB

  files.forEach(file => {
    if (!allowedTypes.includes(file.type)) {
      alert(`File type not supported: ${file.name}`)
      return
    }
    if (file.size > maxSize) {
      alert(`File too large: ${file.name}`)
      return
    }
    selectedFiles.value.push(file)
  })
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) return
  isUploading.value = true

  try {
    for (let i = 0; i < selectedFiles.value.length; i++) {
      const file = selectedFiles.value[i]
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        file.progress = progress
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    // In a real application, you would use FormData and axios to upload the files
    // const formData = new FormData()
    // selectedFiles.value.forEach(file => formData.append('files', file))
    // await axios.post('/api/documents/upload', formData)

    emit('upload-complete', selectedFiles.value)
    selectedFiles.value = []
    isUploading.value = false
  } catch (error) {
    console.error('Upload failed:', error)
    alert('Failed to upload files')
    isUploading.value = false
  }
}
</script> 