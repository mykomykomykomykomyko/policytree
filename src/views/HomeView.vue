<template>
  <div class="min-h-screen">
    <div class="content-wrapper">
      <!-- Hero Section -->
      <div class="relative isolate px-6 pt-14 lg:px-8">
        <div class="mx-auto max-w-4xl py-32 sm:py-48">
          <div class="text-center">
            <h1 class="text-6xl font-bold tracking-tight text-white sm:text-7xl">
              PolicyTree
              <span class="block text-primary-200">AI-Powered Policy Management</span>
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-100">
              Transform your policy management with advanced AI capabilities. Connect with Alberta Open Data, analyze documents intelligently, and make informed decisions faster than ever.
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
              <router-link to="/documents" class="rounded-full bg-white/10 px-8 py-3 text-lg font-semibold text-white shadow-sm backdrop-blur-sm hover:bg-white/20 transition-all">
                Get Started
              </router-link>
              <a href="#features" class="text-lg font-semibold leading-6 text-gray-100 hover:text-white">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div id="features" class="py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">Intelligent Policy Management</h2>
            <p class="mt-6 text-lg leading-8 text-gray-100">
              Harness the power of AI to streamline your policy development and management process.
            </p>
          </div>
          <div class="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
            <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              <div class="feature-card">
                <div class="mb-6">
                  <div class="feature-icon">
                    <DocumentMagnifyingGlassIcon class="h-6 w-6 text-white" />
                  </div>
                </div>
                <dt class="text-xl font-semibold leading-7 text-white">Alberta Open Data Integration</dt>
                <dd class="mt-2 text-base leading-7 text-gray-100">
                  Seamlessly connect with Alberta's Open Data Portal. Search, analyze, and import policy documents directly into your workspace.
                </dd>
              </div>
              <div class="feature-card">
                <div class="mb-6">
                  <div class="feature-icon">
                    <SparklesIcon class="h-6 w-6 text-white" />
                  </div>
                </div>
                <dt class="text-xl font-semibold leading-7 text-white">AI-Powered Analysis</dt>
                <dd class="mt-2 text-base leading-7 text-gray-100">
                  Leverage advanced AI to extract insights, summarize documents, and identify key policy relationships automatically.
                </dd>
              </div>
              <div class="feature-card">
                <div class="mb-6">
                  <div class="feature-icon">
                    <ChatBubbleLeftRightIcon class="h-6 w-6 text-white" />
                  </div>
                </div>
                <dt class="text-xl font-semibold leading-7 text-white">Interactive AI Assistant</dt>
                <dd class="mt-2 text-base leading-7 text-gray-100">
                  Chat with our AI assistant to get instant answers about your policies, find related documents, and receive recommendations.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Integration Section -->
      <div class="relative isolate py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
            <div class="lg:pr-8">
              <div class="lg:max-w-lg">
                <h2 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">AI Agent Integration</h2>
                <p class="mt-6 text-lg leading-8 text-gray-100">
                  Our AI agents work seamlessly together to provide a comprehensive policy management solution:
                </p>
                <dl class="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-100 lg:max-w-none">
                  <div class="relative">
                    <dt class="font-semibold text-white">Document Analysis Agent</dt>
                    <dd class="mt-2">Automatically extracts key information, identifies policy relationships, and generates summaries.</dd>
                  </div>
                  <div class="relative">
                    <dt class="font-semibold text-white">Search & Discovery Agent</dt>
                    <dd class="mt-2">Intelligently searches through Alberta Open Data and your internal documents to find relevant policies.</dd>
                  </div>
                  <div class="relative">
                    <dt class="font-semibold text-white">Chat Assistant Agent</dt>
                    <dd class="mt-2">Provides natural language interactions for policy queries and document exploration.</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div class="flex items-center justify-center">
              <div class="rounded-2xl bg-white/5 p-8 backdrop-blur-lg">
                <pre class="text-sm text-gray-100">
<code>{
  "agents": {
    "document_analysis": {
      "status": "active",
      "capabilities": [
        "extraction",
        "summarization",
        "relationship_mapping"
      ]
    },
    "search": {
      "status": "active",
      "data_sources": [
        "alberta_open_data",
        "internal_documents"
      ]
    },
    "chat": {
      "status": "active",
      "models": [
        "gpt-4",
        "custom_policy_model"
      ]
    }
  }
}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DocumentMagnifyingGlassIcon, SparklesIcon, ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline'
</script>

<style scoped>
.feature-card {
  @apply relative rounded-2xl p-8 backdrop-blur-sm bg-white/5;
  transition: all 0.3s ease;
}

.feature-card:hover {
  @apply bg-white/10;
  transform: translateY(-4px);
}

.feature-icon {
  @apply flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/10 backdrop-blur-sm;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Glass morphism effect for cards */
.feature-card, .rounded-2xl {
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}
</style> 