<template>
  <div class="space-y-6">
    <header class="bg-gray-800/50 backdrop-blur-sm shadow">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold tracking-tight text-white">Documents</h1>
          <div class="flex space-x-4">
            <button
              @click="showOpenDataModal = true"
              class="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-100 bg-gray-800/50 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <MagnifyingGlassIcon class="h-5 w-5 mr-2" />
              Search Open Data
            </button>
            <button
              @click="showUploadModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 transition-colors"
            >
              <PlusIcon class="h-5 w-5 mr-2" />
              Upload Document
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Search and Filters -->
    <div class="bg-gray-800/50 backdrop-blur-sm shadow rounded-lg p-6">
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
              class="block w-full bg-gray-900/50 text-gray-100 rounded-md border-gray-700 pl-10 focus:border-primary-500 focus:ring-primary-500/20 sm:text-sm placeholder-gray-500"
              placeholder="Search documents..."
            >
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <select
            v-model="selectedType"
            class="rounded-md bg-gray-900/50 text-gray-100 border-gray-700 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500/20 sm:text-sm"
          >
            <option value="">All Types</option>
            <option>Policy</option>
            <option>Procedure</option>
            <option>Guidelines</option>
          </select>
          <select
            v-model="sortBy"
            class="rounded-md bg-gray-900/50 text-gray-100 border-gray-700 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500/20 sm:text-sm"
          >
            <option value="name">Name</option>
            <option value="date">Date</option>
            <option value="type">Type</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Documents Table -->
    <div class="bg-gray-800/50 backdrop-blur-sm shadow rounded-lg">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-200 sm:pl-6">Name</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-200">Type</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-200">Last Modified</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-200">Size</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="document in filteredDocuments" :key="document.id" class="hover:bg-gray-700/50 transition-colors">
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div class="flex items-center">
                  <DocumentIcon class="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div class="font-medium text-gray-100">{{ document.name }}</div>
                    <div class="text-gray-400">{{ document.description }}</div>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{{ document.type }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{{ document.modified }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{{ document.size }}</td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button class="text-primary-400 hover:text-primary-300 mr-4 transition-colors">Edit</button>
                <button 
                  @click="deleteDocument(document.id)"
                  class="text-red-400 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Upload Modal -->
    <TransitionRoot appear :show="showUploadModal" as="template">
      <Dialog as="div" @close="showUploadModal = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/75" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-lg bg-gray-800 p-6 shadow-xl transition-all">
                <div class="flex items-center justify-between mb-4">
                  <DialogTitle as="h3" class="text-lg font-medium text-white">
                    Upload Documents
                  </DialogTitle>
                  <button
                    @click="showUploadModal = false"
                    class="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>
                <DocumentUpload 
                  @upload-complete="handleUploadComplete"
                  @close="showUploadModal = false"
                />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Open Data Modal -->
    <TransitionRoot appear :show="showOpenDataModal" as="template">
      <Dialog as="div" @close="showOpenDataModal = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/75" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-4xl transform overflow-hidden rounded-lg bg-gray-800 p-6 shadow-xl transition-all">
                <div class="flex items-center justify-between mb-4">
                  <DialogTitle as="h3" class="text-lg font-medium text-white">
                    Search Alberta Open Data
                  </DialogTitle>
                  <button
                    @click="showOpenDataModal = false"
                    class="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>
                <AlbertaOpenDataExplorer 
                  @close="showOpenDataModal = false"
                />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { DocumentIcon, PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import DocumentUpload from '../components/DocumentUpload.vue'
import AlbertaOpenDataExplorer from '../components/AlbertaOpenDataExplorer.vue'

const searchQuery = ref('')
const selectedType = ref('')
const sortBy = ref('name')
const showUploadModal = ref(false)
const showOpenDataModal = ref(false)

const documents = ref([
  {
    id: 1,
    name: 'FOIP Act Guidelines 2024',
    description: 'Freedom of Information and Protection of Privacy Act implementation guidelines',
    type: 'Policy',
    modified: '2024-03-10',
    size: '3.2 MB'
  },
  {
    id: 2,
    name: 'Alberta Data Security Framework',
    description: 'Comprehensive security protocols and standards for government data',
    type: 'Guidelines',
    modified: '2024-03-08',
    size: '2.8 MB'
  },
  {
    id: 3,
    name: 'Remote Work Security Policy',
    description: 'Security guidelines for government employees working remotely',
    type: 'Policy',
    modified: '2024-03-05',
    size: '1.5 MB'
  },
  {
    id: 4,
    name: 'Health Information Act Compliance',
    description: 'Guidelines for handling health information under Alberta HIA',
    type: 'Guidelines',
    modified: '2024-03-03',
    size: '4.1 MB'
  },
  {
    id: 5,
    name: 'Data Sharing Agreement Template',
    description: 'Standard template for inter-departmental data sharing',
    type: 'Procedure',
    modified: '2024-03-01',
    size: '956 KB'
  },
  {
    id: 6,
    name: 'Open Data Publication Guide',
    description: 'Procedures for publishing data on the Alberta Open Data Portal',
    type: 'Procedure',
    modified: '2024-02-28',
    size: '2.1 MB'
  },
  {
    id: 7,
    name: 'Records Management Policy',
    description: 'Guidelines for managing government records and documents',
    type: 'Policy',
    modified: '2024-02-25',
    size: '3.5 MB'
  },
  {
    id: 8,
    name: 'Data Classification Standards',
    description: 'Standards for classifying government data sensitivity levels',
    type: 'Guidelines',
    modified: '2024-02-20',
    size: '1.8 MB'
  },
  {
    id: 9,
    name: 'Privacy Impact Assessment Template',
    description: 'Template and guidelines for conducting privacy impact assessments',
    type: 'Procedure',
    modified: '2024-02-15',
    size: '1.2 MB'
  },
  {
    id: 10,
    name: 'Information Security Incident Response',
    description: 'Procedures for handling information security incidents',
    type: 'Procedure',
    modified: '2024-02-10',
    size: '2.4 MB'
  },
  {
    id: 11,
    name: 'Data Innovation Strategy 2024',
    description: 'Strategic framework for data-driven innovation in Alberta',
    type: 'Policy',
    modified: '2024-02-05',
    size: '5.1 MB'
  },
  {
    id: 12,
    name: 'Digital Service Standard',
    description: 'Standards for digital service delivery in Alberta government',
    type: 'Guidelines',
    modified: '2024-02-01',
    size: '2.9 MB'
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

const handleUploadComplete = (files) => {
  // Add uploaded files to documents list
  files.forEach(file => {
    documents.value.push({
      id: documents.value.length + 1,
      name: file.name,
      description: 'Uploaded document',
      type: 'Document',
      modified: new Date().toISOString().split('T')[0],
      size: formatFileSize(file.size)
    })
  })
  showUploadModal.value = false
}

const deleteDocument = (id) => {
  if (confirm('Are you sure you want to delete this document?')) {
    documents.value = documents.value.filter(doc => doc.id !== id)
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script> 