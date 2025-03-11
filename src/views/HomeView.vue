<template>
  <div class="min-h-screen">
    <div class="content-wrapper">
      <!-- Hero Section with Animated Background -->
      <div class="relative isolate px-6 pt-14 lg:px-8">
        <div class="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div class="relative aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-500 to-primary-200 opacity-30"></div>
        </div>
        
        <div class="mx-auto max-w-3xl py-32 sm:py-48">
          <div class="text-center">
            <h1 class="text-6xl font-bold tracking-tight text-white sm:text-7xl leading-tight sm:leading-tight max-w-2xl mx-auto">
              <span class="animate-title inline-block mb-2">PolicyTree</span>
              <span class="block text-primary-200 animate-subtitle leading-tight mt-2">AI-Powered Policy Management</span>
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-100 max-w-xl mx-auto">
              Transform your policy management with advanced AI capabilities. Connect with Alberta Open Data, analyze documents intelligently, and make informed decisions faster than ever.
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
              <router-link 
                to="/documents" 
                class="rounded-full bg-primary-500 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-primary-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 transition-all hover:scale-105"
              >
                Get Started
              </router-link>
              <a 
                href="#features" 
                class="text-lg font-semibold leading-6 text-gray-100 hover:text-white transition-all hover:translate-x-2 inline-flex items-center"
              >
                Learn more 
                <span aria-hidden="true" class="ml-2 transition-transform">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="relative py-16">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <dl class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            <div 
              v-for="(stat, index) in stats" 
              :key="index"
              class="feature-card hover:scale-105 transition-all cursor-default"
              @mouseenter="stat.highlighted = true"
              @mouseleave="stat.highlighted = false"
            >
              <dt class="text-sm font-medium text-gray-200">{{ stat.name }}</dt>
              <dd class="mt-2">
                <div class="text-3xl font-bold text-white flex items-center">
                  <CountUp 
                    :endVal="stat.value" 
                    :duration="2.5" 
                    :autoplay="true" 
                    @finished="stat.counted = true"
                  />
                  <span class="ml-0.5">{{ stat.suffix }}</span>
                </div>
                <p class="mt-1 text-sm text-gray-300">{{ stat.description }}</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Features Section with Hover Effects -->
      <div id="features" class="py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Intelligent Policy Management
            </h2>
            <p class="mt-6 text-lg leading-8 text-gray-100">
              Harness the power of AI to streamline your policy development and management process.
            </p>
          </div>
          <div class="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
            <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              <div 
                v-for="(feature, index) in features" 
                :key="index"
                class="feature-card group"
                :class="{ 'feature-card-active': feature.active }"
                @mouseenter="feature.active = true"
                @mouseleave="feature.active = false"
              >
                <div class="mb-6">
                  <div class="feature-icon group-hover:scale-110 transition-transform">
                    <component :is="feature.icon" class="h-6 w-6 text-white" />
                  </div>
                </div>
                <dt class="text-xl font-semibold leading-7 text-white">{{ feature.title }}</dt>
                <dd class="mt-2 text-base leading-7 text-gray-100">
                  {{ feature.description }}
                </dd>
                <div class="mt-4 flex items-center text-primary-300 transition-opacity opacity-0 group-hover:opacity-100">
                  <span class="text-sm">Learn more</span>
                  <ArrowRightIcon class="h-4 w-4 ml-1" />
                </div>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Use Cases Section -->
      <div class="py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">Real-World Applications</h2>
            <p class="mt-6 text-lg leading-8 text-gray-100">
              See how organizations are transforming their policy management with PolicyTree.
            </p>
          </div>
          <div class="mt-16">
            <TransitionGroup 
              name="use-cases"
              tag="div"
              class="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            >
              <div 
                v-for="(useCase, index) in visibleUseCases" 
                :key="useCase.id"
                class="feature-card group cursor-pointer"
                @click="expandUseCase(index)"
              >
                <div class="relative overflow-hidden rounded-lg mb-4 aspect-video">
                  <img :src="useCase.image" :alt="useCase.title" class="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500">
                </div>
                <h3 class="text-xl font-semibold text-white mb-2">{{ useCase.title }}</h3>
                <p class="text-gray-300">{{ useCase.description }}</p>
                <div class="mt-4 flex items-center text-primary-300">
                  <span class="text-sm">View case study</span>
                  <ArrowRightIcon class="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>

      <!-- Integration Section with Interactive Demo -->
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
                  <TransitionGroup name="list">
                    <div 
                      v-for="(agent, index) in agents" 
                      :key="agent.id"
                      class="relative p-4 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                      @mouseenter="activeAgent = index"
                    >
                      <dt class="font-semibold text-white flex items-center">
                        <component :is="agent.icon" class="h-5 w-5 mr-2 text-primary-400" />
                        {{ agent.title }}
                      </dt>
                      <dd class="mt-2">{{ agent.description }}</dd>
                    </div>
                  </TransitionGroup>
                </dl>
              </div>
            </div>
            <div class="flex items-center justify-center">
              <div class="rounded-2xl bg-white/5 p-8 backdrop-blur-lg w-full max-w-lg">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex space-x-2">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div class="text-sm text-gray-400">demo.js</div>
                </div>
                <pre class="text-sm text-gray-100 overflow-x-auto">
                  <TypeWriter 
                    :text="currentAgentCode" 
                    :delay="50"
                  />
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="relative isolate px-6 py-24 sm:py-32 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to enhance your policy management?
          </h2>
          <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Contact us to learn more about implementing PolicyTree in your department.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <a 
              href="mailto:contact@policytree.alberta.ca" 
              class="rounded-full bg-primary-500 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-primary-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 transition-all hover:scale-105"
            >
              Contact Us
            </a>
            <a href="#features" class="text-lg font-semibold leading-6 text-gray-100 hover:text-white">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Chat Button -->
    <button
      class="fixed bottom-8 right-8 bg-primary-500 text-white rounded-full p-4 shadow-lg hover:bg-primary-600 transition-all hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 z-50 flex items-center gap-2"
      @click="isChatOpen = !isChatOpen"
    >
      <ChatBubbleLeftRightIcon class="h-6 w-6" />
      <span class="font-semibold">Chat with AI</span>
    </button>

    <!-- Chat Window -->
    <ChatWindow 
      :is-open="isChatOpen" 
      @close="isChatOpen = false" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  DocumentMagnifyingGlassIcon, 
  SparklesIcon, 
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  BeakerIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'
import CountUp from 'vue-countup-v3'
import TypeWriter from '@/components/TypeWriter.vue'
import ChatWindow from '@/components/ChatWindow.vue'

// Chat state
const isChatOpen = ref(false)

// Stats Data
const stats = ref([
  { 
    name: 'Documents Analyzed', 
    value: 25,
    suffix: '',
    description: 'Policy documents processed through our system',
    highlighted: false,
    counted: false
  },
  { 
    name: 'Processing Time', 
    value: 40,
    suffix: '%',
    description: 'Faster than manual processing',
    highlighted: false,
    counted: false
  },
  { 
    name: 'Departments', 
    value: 3,
    suffix: '',
    description: 'Government departments connected',
    highlighted: false,
    counted: false
  },
  { 
    name: 'Data Sources', 
    value: 5,
    suffix: '',
    description: 'Integrated Alberta Open Data sources',
    highlighted: false,
    counted: false
  }
])

// Features Data
const features = ref([
  {
    icon: DocumentMagnifyingGlassIcon,
    title: 'Alberta Open Data Integration',
    description: 'Seamlessly connect with Alberta\'s Open Data Portal. Search, analyze, and import policy documents directly into your workspace.',
    active: false
  },
  {
    icon: SparklesIcon,
    title: 'AI-Powered Analysis',
    description: 'Leverage advanced AI to extract insights, summarize documents, and identify key policy relationships automatically.',
    active: false
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Interactive AI Assistant',
    description: 'Chat with our AI assistant to get instant answers about your policies, find related documents, and receive recommendations.',
    active: false
  }
])

// Use Cases Data
const useCases = ref([
  {
    id: 1,
    title: 'Policy Development',
    description: 'Streamline your policy development process with AI-assisted research and analysis',
    image: 'https://placehold.co/600x400/1e40af/ffffff?text=Policy+Development'
  },
  {
    id: 2,
    title: 'Document Management',
    description: 'Efficiently organize and analyze your department\'s policy documents',
    image: 'https://placehold.co/600x400/0f766e/ffffff?text=Document+Management'
  },
  {
    id: 3,
    title: 'Cross-Department Collaboration',
    description: 'Connect and share insights across government departments',
    image: 'https://placehold.co/600x400/7e22ce/ffffff?text=Collaboration'
  }
])

const visibleUseCases = ref([])

// AI Agents Data
const agents = ref([
  {
    id: 1,
    title: 'Document Analysis Agent',
    description: 'Automatically extracts key information, identifies policy relationships, and generates summaries.',
    icon: BeakerIcon,
    code: `async function analyzeDocument(doc) {
  const analysis = await ai.extract({
    text: doc.content,
    features: ['entities', 'summary']
  })
  return analysis
}`
  },
  {
    id: 2,
    title: 'Search & Discovery Agent',
    description: 'Intelligently searches through Alberta Open Data and your internal documents to find relevant policies.',
    icon: ChartBarIcon,
    code: `async function searchPolicies(query) {
  const results = await ai.search({
    query,
    sources: ['alberta_open_data', 'internal']
  })
  return results
}`
  },
  {
    id: 3,
    title: 'Chat Assistant Agent',
    description: 'Provides natural language interactions for policy queries and document exploration.',
    icon: ShieldCheckIcon,
    code: `async function chatResponse(message) {
  const response = await ai.chat({
    model: 'gpt-4',
    context: 'policy_knowledge_base',
    message
  })
  return response
}`
  }
])

const activeAgent = ref(0)
const currentAgentCode = computed(() => agents.value[activeAgent.value].code)

// Methods
const expandUseCase = (index) => {
  // Implementation for expanding use case details
}
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

/* Transitions */
.use-cases-enter-active,
.use-cases-leave-active {
  transition: all 0.5s ease;
}

.use-cases-enter-from,
.use-cases-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom animations */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.floating {
  animation: float 3s ease-in-out infinite;
}

/* Text animation effects */
.animate-title {
  display: inline-block;
  animation: titleGlow 3s ease-in-out infinite;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.9) 50%,
    rgba(255, 255, 255, 1) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.animate-subtitle {
  animation: subtitleGlow 4s ease-in-out infinite;
  background: linear-gradient(
    90deg,
    rgba(148, 163, 184, 1) 0%,
    rgba(186, 230, 253, 1) 50%,
    rgba(148, 163, 184, 1) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 15px rgba(186, 230, 253, 0.3);
}

@keyframes titleGlow {
  0%, 100% {
    opacity: 1;
    filter: brightness(1);
  }
  50% {
    opacity: 0.95;
    filter: brightness(1.1);
  }
}

@keyframes subtitleGlow {
  0%, 100% {
    opacity: 0.9;
    filter: brightness(1);
  }
  50% {
    opacity: 1;
    filter: brightness(1.2);
  }
}
</style> 