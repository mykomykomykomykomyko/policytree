<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">Knowledge Graph</h1>
      <div class="flex space-x-4">
        <select v-model="selectedCategory" class="input-field">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
        <button @click="resetZoom" class="btn-secondary">
          Reset View
        </button>
      </div>
    </div>

    <div class="card">
      <div class="flex space-x-4 mb-4">
        <div class="flex-1">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search nodes..."
            class="input-field"
          />
        </div>
        <div class="flex space-x-2">
          <button
            v-for="action in graphActions"
            :key="action.name"
            @click="action.handler"
            class="btn-secondary flex items-center space-x-2"
            :class="{ 'bg-primary-100 text-primary-700': action.active }"
          >
            <component :is="action.icon" class="h-5 w-5" />
            <span>{{ action.name }}</span>
          </button>
        </div>
      </div>

      <div ref="graphContainer" class="w-full h-[600px] border border-gray-200 rounded-lg"></div>
    </div>

    <!-- Node Details Modal -->
    <div v-if="selectedNode" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">{{ selectedNode.title }}</h2>
          <button @click="selectedNode = null" class="text-gray-400 hover:text-gray-500">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <h3 class="text-sm font-medium text-gray-500">Category</h3>
            <p class="mt-1 text-sm text-gray-900">{{ selectedNode.category }}</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-500">Description</h3>
            <p class="mt-1 text-sm text-gray-900">{{ selectedNode.description }}</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-500">Related Policies</h3>
            <ul class="mt-1 space-y-2">
              <li
                v-for="policy in selectedNode.relatedPolicies"
                :key="policy.id"
                class="text-sm text-primary-600 hover:text-primary-700 cursor-pointer"
              >
                {{ policy.title }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as d3 from 'd3'
import {
  MagnifyingGlassIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const graphContainer = ref(null)
const selectedNode = ref(null)
const searchQuery = ref('')
const selectedCategory = ref('')
const categories = ref(['HR', 'Security', 'Finance', 'Operations'])

// Sample data - replace with actual API call
const graphData = {
  nodes: [
    {
      id: 1,
      title: 'HR Policy 2023',
      category: 'HR',
      description: 'Main HR policy document for 2023',
      relatedPolicies: [
        { id: 2, title: 'Remote Work Guidelines' },
        { id: 3, title: 'Employee Benefits' }
      ]
    },
    {
      id: 2,
      title: 'Remote Work Guidelines',
      category: 'HR',
      description: 'Guidelines for remote work arrangements',
      relatedPolicies: [
        { id: 1, title: 'HR Policy 2023' },
        { id: 4, title: 'Security Protocol' }
      ]
    },
    // Add more nodes as needed
  ],
  links: [
    { source: 1, target: 2, type: 'relates_to' },
    { source: 2, target: 4, type: 'depends_on' },
    // Add more links as needed
  ]
}

const graphActions = ref([
  { name: 'Zoom In', icon: ArrowsPointingOutIcon, handler: () => zoom(1.2), active: false },
  { name: 'Zoom Out', icon: ArrowsPointingInIcon, handler: () => zoom(0.8), active: false },
  { name: 'Reset', icon: ArrowPathIcon, handler: resetZoom, active: false }
])

let svg, simulation, zoom, resetZoom

const initGraph = () => {
  const width = graphContainer.value.clientWidth
  const height = graphContainer.value.clientHeight

  // Clear previous graph
  d3.select(graphContainer.value).selectAll('*').remove()

  // Create SVG
  svg = d3.select(graphContainer.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // Create zoom behavior
  zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      svg.select('g').attr('transform', event.transform)
    })

  svg.call(zoom)

  // Create container for graph elements
  const g = svg.append('g')

  // Create simulation
  simulation = d3.forceSimulation(graphData.nodes)
    .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))

  // Create links
  const links = g.append('g')
    .selectAll('line')
    .data(graphData.links)
    .join('line')
    .attr('stroke', '#999')
    .attr('stroke-width', 1)

  // Create nodes
  const nodes = g.append('g')
    .selectAll('g')
    .data(graphData.nodes)
    .join('g')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))

  // Add circles to nodes
  nodes.append('circle')
    .attr('r', 20)
    .attr('fill', d => getNodeColor(d.category))

  // Add labels to nodes
  nodes.append('text')
    .text(d => d.title)
    .attr('x', 25)
    .attr('y', 5)
    .attr('font-size', '12px')
    .attr('fill', '#333')

  // Add click handler to nodes
  nodes.on('click', (event, d) => {
    selectedNode.value = d
  })

  // Update positions on each tick
  simulation.on('tick', () => {
    links
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    nodes.attr('transform', d => `translate(${d.x},${d.y})`)
  })

  // Reset zoom function
  resetZoom = () => {
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity)
  }
}

const getNodeColor = (category) => {
  const colors = {
    'HR': '#3B82F6',
    'Security': '#10B981',
    'Finance': '#8B5CF6',
    'Operations': '#F59E0B'
  }
  return colors[category] || '#6B7280'
}

const dragstarted = (event) => {
  if (!event.active) simulation.alphaTarget(0.3).restart()
  event.subject.fx = event.subject.x
  event.subject.fy = event.subject.y
}

const dragged = (event) => {
  event.subject.fx = event.x
  event.subject.fy = event.y
}

const dragended = (event) => {
  if (!event.active) simulation.alphaTarget(0)
  event.subject.fx = null
  event.subject.fy = null
}

onMounted(() => {
  initGraph()
})

onUnmounted(() => {
  if (simulation) {
    simulation.stop()
  }
})
</script> 