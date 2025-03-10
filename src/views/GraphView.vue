<template>
  <div class="space-y-6">
    <header class="bg-white shadow">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">Knowledge Graph</h1>
          <div class="flex space-x-4">
            <button class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <AdjustmentsHorizontalIcon class="h-5 w-5 mr-2 text-gray-400" />
              Filter
            </button>
            <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <ArrowDownTrayIcon class="h-5 w-5 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-12 gap-6">
      <!-- Sidebar -->
      <div class="col-span-3">
        <div class="bg-white shadow rounded-lg p-6 space-y-6">
          <!-- Search -->
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700">Search Nodes</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="search"
                id="search"
                v-model="searchQuery"
                class="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Search..."
              >
            </div>
          </div>

          <!-- Filters -->
          <div>
            <h3 class="text-sm font-medium text-gray-700">Node Types</h3>
            <div class="mt-2 space-y-2">
              <label v-for="type in nodeTypes" :key="type.id" class="flex items-center">
                <input
                  type="checkbox"
                  :value="type.id"
                  v-model="selectedTypes"
                  class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                >
                <span class="ml-2 text-sm text-gray-600">{{ type.name }}</span>
              </label>
            </div>
          </div>

          <!-- Layout Controls -->
          <div>
            <h3 class="text-sm font-medium text-gray-700">Layout</h3>
            <div class="mt-2">
              <select
                v-model="layout"
                class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
              >
                <option value="force">Force-Directed</option>
                <option value="radial">Radial</option>
                <option value="hierarchical">Hierarchical</option>
              </select>
            </div>
          </div>

          <!-- Statistics -->
          <div>
            <h3 class="text-sm font-medium text-gray-700">Statistics</h3>
            <dl class="mt-2 grid grid-cols-1 gap-4">
              <div class="bg-gray-50 px-4 py-3 rounded-lg">
                <dt class="text-xs font-medium text-gray-500">Total Nodes</dt>
                <dd class="mt-1 text-lg font-semibold text-gray-900">{{ nodes.length }}</dd>
              </div>
              <div class="bg-gray-50 px-4 py-3 rounded-lg">
                <dt class="text-xs font-medium text-gray-500">Total Connections</dt>
                <dd class="mt-1 text-lg font-semibold text-gray-900">{{ links.length }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Graph Visualization -->
      <div class="col-span-9">
        <div class="bg-white shadow rounded-lg" style="height: 700px;">
          <div ref="graphContainer" class="w-full h-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { AdjustmentsHorizontalIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import * as d3 from 'd3'

const searchQuery = ref('')
const selectedTypes = ref([])
const layout = ref('force')
const graphContainer = ref(null)

const nodeTypes = [
  { id: 'policy', name: 'Policy' },
  { id: 'procedure', name: 'Procedure' },
  { id: 'regulation', name: 'Regulation' },
  { id: 'stakeholder', name: 'Stakeholder' }
]

// Sample data - replace with actual data
const nodes = ref([
  { id: 1, name: 'Privacy Policy', type: 'policy', group: 1 },
  { id: 2, name: 'Data Protection', type: 'regulation', group: 2 },
  { id: 3, name: 'HR Guidelines', type: 'procedure', group: 1 },
  { id: 4, name: 'Legal Team', type: 'stakeholder', group: 3 },
  { id: 5, name: 'Security Policy', type: 'policy', group: 2 }
])

const links = ref([
  { source: 1, target: 2, value: 1 },
  { source: 1, target: 4, value: 2 },
  { source: 2, target: 5, value: 3 },
  { source: 3, target: 4, value: 1 },
  { source: 4, target: 5, value: 2 }
])

// D3.js visualization setup
let simulation = null

const initializeGraph = () => {
  const container = graphContainer.value
  const width = container.clientWidth
  const height = container.clientHeight

  // Clear previous SVG
  d3.select(container).selectAll('*').remove()

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const g = svg.append('g')

  // Add zoom behavior
  svg.call(d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform)
    }))

  // Create arrow marker
  svg.append('defs').append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-0 -5 10 10')
    .attr('refX', 20)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#999')
    .style('stroke', 'none')

  // Draw links
  const link = g.append('g')
    .selectAll('line')
    .data(links.value)
    .join('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', d => Math.sqrt(d.value))
    .attr('marker-end', 'url(#arrowhead)')

  // Create node groups
  const node = g.append('g')
    .selectAll('g')
    .data(nodes.value)
    .join('g')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))

  // Add circles to nodes
  node.append('circle')
    .attr('r', 10)
    .attr('fill', d => d3.schemeCategory10[d.group])

  // Add labels to nodes
  node.append('text')
    .attr('dx', 12)
    .attr('dy', '.35em')
    .text(d => d.name)
    .attr('font-size', '12px')

  // Force simulation
  simulation = d3.forceSimulation(nodes.value)
    .force('link', d3.forceLink(links.value).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node
        .attr('transform', d => `translate(${d.x},${d.y})`)
    })
}

// Drag functions
function dragstarted(event) {
  if (!event.active) simulation.alphaTarget(0.3).restart()
  event.subject.fx = event.subject.x
  event.subject.fy = event.subject.y
}

function dragged(event) {
  event.subject.fx = event.x
  event.subject.fy = event.y
}

function dragended(event) {
  if (!event.active) simulation.alphaTarget(0)
  event.subject.fx = null
  event.subject.fy = null
}

// Initialize graph on mount
onMounted(() => {
  initializeGraph()
})

// Reinitialize graph when window is resized
window.addEventListener('resize', initializeGraph)

// Watch for layout changes
watch(layout, () => {
  initializeGraph()
})
</script>

<style>
.graph-container {
  position: relative;
  overflow: hidden;
}

svg {
  display: block;
}

/* Node styling */
circle {
  stroke: #fff;
  stroke-width: 2px;
}

/* Link styling */
line {
  stroke-linecap: round;
}

/* Text styling */
text {
  fill: #333;
  font-family: sans-serif;
  pointer-events: none;
}
</style> 