<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">Policy Assistant</h1>
      <div class="flex space-x-4">
        <select v-model="selectedContext" class="input-field">
          <option value="">All Policies</option>
          <option v-for="context in contexts" :key="context" :value="context">
            {{ context }}
          </option>
        </select>
        <button @click="clearChat" class="btn-secondary">
          Clear Chat
        </button>
      </div>
    </div>

    <div class="card">
      <div class="flex flex-col h-[600px]">
        <!-- Chat Messages -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto space-y-4 p-4">
          <div
            v-for="message in messages"
            :key="message.id"
            class="flex"
            :class="{ 'justify-end': message.type === 'user' }"
          >
            <div
              class="max-w-[70%] rounded-lg p-3"
              :class="{
                'bg-primary-100 text-primary-900': message.type === 'user',
                'bg-gray-100 text-gray-900': message.type === 'assistant'
              }"
            >
              <div class="text-sm">{{ message.content }}</div>
              <div v-if="message.citations" class="mt-2 text-xs text-gray-500">
                <div v-for="citation in message.citations" :key="citation.id" class="flex items-center space-x-1">
                  <DocumentIcon class="h-3 w-3" />
                  <span>{{ citation.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="border-t border-gray-200 p-4">
          <div class="flex space-x-4">
            <div class="flex-1">
              <textarea
                v-model="userInput"
                @keydown.enter.prevent="sendMessage"
                placeholder="Ask about policies..."
                class="input-field resize-none"
                rows="2"
              ></textarea>
            </div>
            <button
              @click="sendMessage"
              class="btn-primary self-end"
              :disabled="!userInput.trim() || isProcessing"
            >
              <PaperAirplaneIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Processing Indicator -->
    <div v-if="isProcessing" class="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center space-x-2">
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
      <span class="text-sm text-gray-600">Processing your query...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { DocumentIcon, PaperAirplaneIcon } from '@heroicons/vue/24/outline'

const messagesContainer = ref(null)
const userInput = ref('')
const isProcessing = ref(false)
const selectedContext = ref('')
const contexts = ref(['HR', 'Security', 'Finance', 'Operations'])

const messages = ref([
  {
    id: 1,
    type: 'assistant',
    content: 'Hello! I\'m your Policy Assistant. How can I help you today?',
    citations: []
  }
])

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isProcessing.value) return

  const userMessage = {
    id: messages.value.length + 1,
    type: 'user',
    content: userInput.value,
    citations: []
  }

  messages.value.push(userMessage)
  await scrollToBottom()

  isProcessing.value = true
  userInput.value = ''

  // Simulate API call
  setTimeout(() => {
    const assistantMessage = {
      id: messages.value.length + 1,
      type: 'assistant',
      content: 'I understand your query. Let me check the relevant policies...',
      citations: [
        { id: 1, title: 'HR Policy 2023' },
        { id: 2, title: 'Remote Work Guidelines' }
      ]
    }
    messages.value.push(assistantMessage)
    scrollToBottom()
    isProcessing.value = false
  }, 1500)
}

const clearChat = () => {
  messages.value = [
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your Policy Assistant. How can I help you today?',
      citations: []
    }
  ]
}

onMounted(() => {
  scrollToBottom()
})
</script> 