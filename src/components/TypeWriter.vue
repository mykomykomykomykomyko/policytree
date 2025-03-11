<template>
  <span>{{ displayedText }}</span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  delay: {
    type: Number,
    default: 50
  }
})

const displayedText = ref('')
let currentIndex = 0
let timeoutId = null

const typeText = () => {
  if (currentIndex < props.text.length) {
    displayedText.value += props.text[currentIndex]
    currentIndex++
    timeoutId = setTimeout(typeText, props.delay)
  }
}

watch(() => props.text, (newText) => {
  currentIndex = 0
  displayedText.value = ''
  if (timeoutId) clearTimeout(timeoutId)
  typeText()
}, { immediate: true })

onMounted(() => {
  typeText()
})
</script> 