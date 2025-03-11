<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <div class="fixed bottom-24 right-8 w-96 h-[600px] bg-gray-900 rounded-lg shadow-xl overflow-hidden z-40 transition-transform duration-300" :class="{ 'translate-x-full': !isOpen }">
      <!-- Header -->
      <div class="bg-primary-500 p-4 flex justify-between items-center border-b border-gray-700">
        <h3 class="text-white font-semibold">Chat with AI Assistant</h3>
        <div class="flex items-center gap-2">
          <button 
            @click="clearChat" 
            class="text-white hover:text-gray-200 p-1 rounded transition-colors"
            title="Clear chat"
          >
            <TrashIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div 
        ref="messagesContainer"
        class="h-[calc(100%-8rem)] overflow-y-auto p-4 bg-gray-800 scroll-smooth"
      >
        <TransitionGroup 
          name="message"
          tag="div"
          class="space-y-4"
        >
          <div 
            v-for="(message, index) in messages" 
            :key="index"
            class="group"
          >
            <div :class="[
              'max-w-[80%] rounded-lg p-3 shadow-sm transition-all duration-200 hover:shadow-md backdrop-blur-sm',
              message.type === 'user' 
                ? 'bg-primary-500/90 text-white ml-auto' 
                : 'bg-gray-700/90 text-gray-100 border border-gray-600'
            ]">
              {{ message.text }}
              <div :class="[
                'text-xs mt-1 opacity-50 group-hover:opacity-100 transition-opacity',
                message.type === 'user' ? 'text-gray-200' : 'text-gray-400'
              ]">
                {{ formatTime(message.timestamp) }}
              </div>
            </div>
          </div>
        </TransitionGroup>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex items-center space-x-2 mt-4">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="h-16 bg-gray-900 border-t border-gray-700 p-2">
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 bg-gray-800 text-gray-100 border border-gray-700 rounded-full px-4 py-2 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all placeholder-gray-500"
          >
          <button
            type="submit"
            class="bg-primary-500 text-white rounded-full p-2 hover:bg-primary-600 transition-all hover:scale-105 focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 disabled:hover:scale-100"
            :disabled="!newMessage.trim()"
          >
            <PaperAirplaneIcon class="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { TransitionRoot } from '@headlessui/vue'
import { PaperAirplaneIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const messages = ref([
  { 
    type: 'assistant', 
    text: 'Hello! How can I help you with policy management today?',
    timestamp: new Date()
  }
])
const newMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref(null)

const formatTime = (date) => {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date)
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const clearChat = () => {
  messages.value = [{
    type: 'assistant',
    text: 'Chat history cleared. How can I help you?',
    timestamp: new Date()
  }]
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  
  // Add user message
  messages.value.push({
    type: 'user',
    text: newMessage.value,
    timestamp: new Date()
  })

  // Clear input
  newMessage.value = ''
  
  // Show typing indicator
  isTyping.value = true
  
  // Scroll to bottom
  await scrollToBottom()

  // Simulate AI response (replace with actual AI integration)
  setTimeout(() => {
    isTyping.value = false
    messages.value.push({
      type: 'assistant',
      text: 'I understand your question. Let me help you with that...',
      timestamp: new Date()
    })
    scrollToBottom()
  }, 1500)
}

// Watch for new messages to scroll to bottom
watch(() => messages.value.length, scrollToBottom)

// Handle ESC key
const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Message transitions */
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* Typing indicator animation */
.typing-indicator {
  @apply bg-gray-700/90 p-3 rounded-lg inline-flex space-x-1 border border-gray-600;
  width: fit-content;
}

.typing-indicator span {
  @apply w-2 h-2 bg-gray-400 rounded-full;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* Custom scrollbar */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(107, 114, 128, 0.5) rgba(31, 41, 55, 0.5);
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  @apply bg-gray-800;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-600 rounded-full;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500;
}
</style> 