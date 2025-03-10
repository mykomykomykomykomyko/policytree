<template>
  <div class="h-screen flex flex-col">
    <header class="bg-white shadow flex-shrink-0">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">Policy Chat</h1>
          <div class="flex items-center space-x-4">
            <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <span class="h-2 w-2 mr-2 bg-green-400 rounded-full"></span>
              Online
            </span>
          </div>
        </div>
      </div>
    </header>

    <div class="flex-1 min-h-0 flex">
      <!-- Sidebar -->
      <div class="w-64 bg-gray-50 border-r border-gray-200 flex-shrink-0">
        <div class="h-full flex flex-col">
          <!-- Search -->
          <div class="p-4 border-b border-gray-200">
            <div class="relative rounded-md shadow-sm">
              <input
                type="text"
                v-model="searchQuery"
                class="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Search conversations..."
              >
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- Conversation List -->
          <div class="flex-1 min-h-0 overflow-y-auto">
            <nav class="px-2 py-4 space-y-1">
              <button
                v-for="chat in filteredChats"
                :key="chat.id"
                @click="selectChat(chat)"
                class="w-full text-left px-3 py-2 rounded-md text-sm font-medium"
                :class="[
                  selectedChat?.id === chat.id
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                ]"
              >
                <div class="flex items-center justify-between">
                  <span class="truncate">{{ chat.title }}</span>
                  <span
                    v-if="chat.unread"
                    class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {{ chat.unread }}
                  </span>
                </div>
                <p class="mt-1 text-xs text-gray-500 truncate">
                  {{ chat.lastMessage }}
                </p>
              </button>
            </nav>
          </div>

          <!-- New Chat Button -->
          <div class="p-4 border-t border-gray-200">
            <button
              @click="startNewChat"
              class="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon class="h-5 w-5 mr-2" />
              New Chat
            </button>
          </div>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="flex-1 flex flex-col bg-white">
        <div v-if="selectedChat" class="flex-1 min-h-0">
          <!-- Chat Messages -->
          <div class="h-full flex flex-col">
            <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="messageContainer">
              <div
                v-for="message in selectedChat.messages"
                :key="message.id"
                :class="[
                  'flex',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                ]"
              >
                <div
                  class="max-w-lg rounded-lg px-4 py-2 space-y-1"
                  :class="[
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  ]"
                >
                  <p class="text-sm">{{ message.content }}</p>
                  <p class="text-xs opacity-75">{{ message.time }}</p>
                </div>
              </div>
            </div>

            <!-- Message Input -->
            <div class="flex-shrink-0 bg-white border-t border-gray-200 p-4">
              <div class="flex space-x-3">
                <div class="flex-1">
                  <textarea
                    v-model="newMessage"
                    rows="1"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Type your message..."
                    @keydown.enter.prevent="sendMessage"
                  ></textarea>
                </div>
                <button
                  @click="sendMessage"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PaperAirplaneIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="flex-1 flex items-center justify-center bg-gray-50"
        >
          <div class="text-center">
            <ChatBubbleLeftRightIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No chat selected</h3>
            <p class="mt-1 text-sm text-gray-500">
              Select a chat from the sidebar or start a new conversation
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'

const searchQuery = ref('')
const newMessage = ref('')
const selectedChat = ref(null)
const messageContainer = ref(null)

// Sample data - replace with actual data
const chats = ref([
  {
    id: 1,
    title: 'Privacy Policy Discussion',
    lastMessage: 'Can you explain section 3.2?',
    unread: 2,
    messages: [
      {
        id: 1,
        content: 'Hello! I need help understanding the privacy policy.',
        sender: 'user',
        time: '10:00 AM'
      },
      {
        id: 2,
        content: 'Of course! Which part would you like me to explain?',
        sender: 'assistant',
        time: '10:01 AM'
      },
      {
        id: 3,
        content: 'Can you explain section 3.2 about data retention?',
        sender: 'user',
        time: '10:02 AM'
      }
    ]
  },
  {
    id: 2,
    title: 'Security Guidelines',
    lastMessage: 'Updated password requirements',
    unread: 0,
    messages: [
      {
        id: 1,
        content: 'We\'ve updated the password requirements in section 2.1',
        sender: 'assistant',
        time: '9:30 AM'
      }
    ]
  }
])

const filteredChats = computed(() => {
  if (!searchQuery.value) return chats.value
  const query = searchQuery.value.toLowerCase()
  return chats.value.filter(chat =>
    chat.title.toLowerCase().includes(query) ||
    chat.lastMessage.toLowerCase().includes(query)
  )
})

const selectChat = (chat) => {
  selectedChat.value = chat
  chat.unread = 0
  scrollToBottom()
}

const startNewChat = () => {
  const newChat = {
    id: chats.value.length + 1,
    title: 'New Conversation',
    lastMessage: '',
    unread: 0,
    messages: []
  }
  chats.value.unshift(newChat)
  selectChat(newChat)
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedChat.value) return

  const message = {
    id: selectedChat.value.messages.length + 1,
    content: newMessage.value,
    sender: 'user',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  selectedChat.value.messages.push(message)
  selectedChat.value.lastMessage = message.content
  newMessage.value = ''

  await nextTick()
  scrollToBottom()

  // Simulate assistant response
  setTimeout(() => {
    const response = {
      id: selectedChat.value.messages.length + 1,
      content: 'I\'ll help you with that. Let me check the policy details...',
      sender: 'assistant',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    selectedChat.value.messages.push(response)
    selectedChat.value.lastMessage = response.content
    scrollToBottom()
  }, 1000)
}

const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

onMounted(() => {
  if (chats.value.length > 0) {
    selectChat(chats.value[0])
  }
})
</script> 