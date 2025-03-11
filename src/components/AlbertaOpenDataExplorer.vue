<template>
  <div class="space-y-6">
    <!-- Search Section -->
    <div class="flex gap-4">
      <div class="flex-1">
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="searchDocuments"
          placeholder="Search Alberta Open Data documents..."
          class="input-field"
        />
      </div>
      <button
        @click="searchDocuments"
        class="btn-primary"
      >
        <MagnifyingGlassIcon class="h-5 w-5 mr-2" />
        Search
      </button>
    </div>

    <!-- Results Section -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="documents.length > 0" class="space-y-4">
      <!-- Results Count -->
      <div class="text-sm text-gray-600">
        Found {{ totalResults }} documents
      </div>

      <!-- Documents List -->
      <div class="space-y-4">
        <div v-for="doc in documents" :key="doc.id" class="bg-white shadow rounded-lg p-4">
          <div class="flex justify-between">
            <div class="space-y-2">
              <h3 class="text-lg font-medium text-gray-900">
                {{ doc.title }}
              </h3>
              <p class="text-sm text-gray-600">{{ doc.notes }}</p>
              
              <!-- Metadata -->
              <div class="flex gap-4 text-sm text-gray-500">
                <span>Format: {{ doc.format || 'N/A' }}</span>
                <span>Updated: {{ formatDate(doc.metadata_modified) }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-start space-x-2">
              <button
                @click="viewDetails(doc)"
                class="btn-secondary"
              >
                View Details
              </button>
              <button
                v-if="doc.resources && doc.resources.length > 0"
                @click="importDocument(doc)"
                class="btn-primary"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center pt-4">
        <button
          :disabled="currentPage === 1"
          @click="previousPage"
          class="btn-secondary"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        >
          Previous
        </button>
        <span class="text-sm text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          :disabled="currentPage === totalPages"
          @click="nextPage"
          class="btn-secondary"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
        >
          Next
        </button>
      </div>
    </div>

    <div v-else-if="searched" class="text-center py-8">
      <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
      <p class="mt-1 text-sm text-gray-500">
        Try adjusting your search terms or filters
      </p>
    </div>

    <!-- Document Details Modal -->
    <TransitionRoot appear :show="showDetailsModal" as="template">
      <Dialog as="div" @close="showDetailsModal = false" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  {{ selectedDocument?.title }}
                </DialogTitle>
                
                <div class="mt-4 space-y-4">
                  <p class="text-sm text-gray-600">{{ selectedDocument?.notes }}</p>

                  <!-- Resources -->
                  <div v-if="selectedDocument?.resources?.length > 0">
                    <h4 class="font-medium text-gray-900 mb-2">Available Resources</h4>
                    <ul class="space-y-2">
                      <li v-for="resource in selectedDocument.resources" :key="resource.id" class="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p class="font-medium">{{ resource.name }}</p>
                          <p class="text-sm text-gray-600">Format: {{ resource.format }}</p>
                        </div>
                        <button
                          @click="downloadResource(resource)"
                          class="btn-secondary text-sm"
                        >
                          Download
                        </button>
                      </li>
                    </ul>
                  </div>

                  <!-- Additional Metadata -->
                  <div>
                    <h4 class="font-medium text-gray-900 mb-2">Additional Information</h4>
                    <dl class="grid grid-cols-2 gap-4">
                      <div>
                        <dt class="text-sm font-medium text-gray-500">Created</dt>
                        <dd class="text-sm text-gray-900">{{ formatDate(selectedDocument?.metadata_created) }}</dd>
                      </div>
                      <div>
                        <dt class="text-sm font-medium text-gray-500">Last Modified</dt>
                        <dd class="text-sm text-gray-900">{{ formatDate(selectedDocument?.metadata_modified) }}</dd>
                      </div>
                      <div>
                        <dt class="text-sm font-medium text-gray-500">License</dt>
                        <dd class="text-sm text-gray-900">{{ selectedDocument?.license_title || 'N/A' }}</dd>
                      </div>
                      <div>
                        <dt class="text-sm font-medium text-gray-500">Organization</dt>
                        <dd class="text-sm text-gray-900">{{ selectedDocument?.organization?.title || 'N/A' }}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
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
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { MagnifyingGlassIcon, DocumentIcon } from '@heroicons/vue/24/outline'
import albertaOpenDataService from '../services/albertaOpenData'

// State
const searchQuery = ref('')
const documents = ref([])
const loading = ref(false)
const searched = ref(false)
const currentPage = ref(1)
const totalResults = ref(0)
const rowsPerPage = 10

// Modal state
const showDetailsModal = ref(false)
const selectedDocument = ref(null)

// Computed
const totalPages = computed(() => Math.ceil(totalResults.value / rowsPerPage))

// Methods
const searchDocuments = async () => {
  if (!searchQuery.value) return

  loading.value = true
  searched.value = true

  try {
    const result = await albertaOpenDataService.searchDocuments(searchQuery.value, {
      limit: rowsPerPage,
      offset: (currentPage.value - 1) * rowsPerPage
    })

    documents.value = result.results
    totalResults.value = result.count
  } catch (error) {
    console.error('Error searching documents:', error)
  } finally {
    loading.value = false
  }
}

const viewDetails = async (document) => {
  selectedDocument.value = document
  showDetailsModal.value = true
}

const downloadResource = async (resource) => {
  try {
    const blob = await albertaOpenDataService.downloadResource(resource.url)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = resource.name
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    a.remove()
  } catch (error) {
    console.error('Error downloading resource:', error)
  }
}

const importDocument = async (document) => {
  // TODO: Implement document import logic
  console.log('Importing document:', document)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    searchDocuments()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    searchDocuments()
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}
</script> 