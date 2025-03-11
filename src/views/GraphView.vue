<template>
  <div class="space-y-6">
    <header class="bg-gray-800/50 backdrop-blur-sm shadow">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold tracking-tight text-white">Knowledge Graph</h1>
          <button
            @click="downloadGraph"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
          >
            <ArrowDownTrayIcon class="h-5 w-5 mr-2" />
            Export Graph
          </button>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-12 gap-6">
      <!-- Sidebar -->
      <div class="col-span-3">
        <div class="bg-gray-800/50 backdrop-blur-sm shadow rounded-lg p-6 space-y-6">
          <!-- Search -->
          <div>
            <label for="search" class="block text-sm font-medium text-gray-200">Search Nodes</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="search"
                id="search"
                v-model="searchQuery"
                class="block w-full bg-gray-900/50 text-gray-100 rounded-md border-gray-700 pl-10 focus:border-primary-500 focus:ring-primary-500/20 sm:text-sm placeholder-gray-500"
                placeholder="Search nodes..."
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div>
            <label class="block text-sm font-medium text-gray-200">Node Types</label>
            <div class="mt-2 space-y-2">
              <div
                v-for="type in nodeTypes"
                :key="type.id"
                class="flex items-center"
              >
                <input
                  :id="type.id"
                  v-model="selectedTypes"
                  :value="type.id"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-700 text-primary-500 focus:ring-primary-500/20 bg-gray-900/50"
                >
                <label :for="type.id" class="ml-2 text-sm text-gray-300">
                  {{ type.name }}
                </label>
              </div>
            </div>
          </div>

          <!-- Layout Options -->
          <div>
            <label class="block text-sm font-medium text-gray-200">Layout</label>
            <select
              v-model="layout"
              class="mt-1 block w-full bg-gray-900/50 text-gray-100 rounded-md border-gray-700 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500/20 sm:text-sm"
            >
              <option value="force">Force-Directed</option>
              <option value="circular">Circular</option>
              <option value="hierarchical">Hierarchical</option>
            </select>
          </div>

          <!-- Statistics -->
          <div>
            <h3 class="text-sm font-medium text-gray-200">Statistics</h3>
            <dl class="mt-2 grid grid-cols-1 gap-4">
              <div class="bg-gray-900/50 px-4 py-3 rounded-lg">
                <dt class="text-xs font-medium text-gray-400">Total Nodes</dt>
                <dd class="mt-1 text-lg font-semibold text-gray-100">{{ nodes.length }}</dd>
              </div>
              <div class="bg-gray-900/50 px-4 py-3 rounded-lg">
                <dt class="text-xs font-medium text-gray-400">Total Connections</dt>
                <dd class="mt-1 text-lg font-semibold text-gray-100">{{ links.length }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Graph Visualization -->
      <div class="col-span-9">
        <div class="bg-gray-800/50 backdrop-blur-sm shadow rounded-lg" style="height: 700px;">
          <div ref="graphContainer" class="w-full h-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { AdjustmentsHorizontalIcon, ArrowDownTrayIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
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
  { id: 1, name: 'Alberta Privacy Framework', type: 'policy', group: 1 },
  { id: 2, name: 'FOIP Act', type: 'regulation', group: 2 },
  { id: 3, name: 'Data Governance', type: 'procedure', group: 1 },
  { id: 4, name: 'Privacy Commissioner', type: 'stakeholder', group: 3 },
  { id: 5, name: 'Information Security Policy', type: 'policy', group: 2 },
  { id: 6, name: 'Records Management', type: 'procedure', group: 1 },
  { id: 7, name: 'Health Information Act', type: 'regulation', group: 2 },
  { id: 8, name: 'Data Sharing Agreement', type: 'policy', group: 1 },
  { id: 9, name: 'IT Security Team', type: 'stakeholder', group: 3 },
  { id: 10, name: 'Cybersecurity Standards', type: 'regulation', group: 2 },
  { id: 11, name: 'Open Data Strategy', type: 'policy', group: 4 },
  { id: 12, name: 'Data Innovation Office', type: 'stakeholder', group: 4 }
])

const links = ref([
  { source: 1, target: 2, value: 3 }, // Privacy Framework linked to FOIP Act
  { source: 1, target: 4, value: 2 }, // Privacy Framework linked to Commissioner
  { source: 2, target: 7, value: 2 }, // FOIP Act linked to Health Information Act
  { source: 3, target: 6, value: 2 }, // Data Governance linked to Records Management
  { source: 4, target: 7, value: 1 }, // Commissioner linked to Health Information Act
  { source: 5, target: 9, value: 3 }, // Security Policy linked to IT Team
  { source: 5, target: 10, value: 2 }, // Security Policy linked to Security Standards
  { source: 6, target: 8, value: 1 }, // Records Management linked to Data Sharing
  { source: 8, target: 11, value: 2 }, // Data Sharing linked to Open Data Strategy
  { source: 9, target: 10, value: 3 }, // IT Team linked to Security Standards
  { source: 11, target: 12, value: 3 }, // Open Data Strategy linked to Innovation Office
  { source: 3, target: 11, value: 2 }, // Data Governance linked to Open Data Strategy
  { source: 1, target: 8, value: 1 }, // Privacy Framework linked to Data Sharing
  { source: 7, target: 8, value: 2 } // Health Information Act linked to Data Sharing
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
    .attr('refX', 23) // Adjusted to not overlap with node
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', 'rgba(156, 163, 175, 0.4)')
    .style('stroke', 'none')

  // Draw links with improved styling
  const link = g.append('g')
    .selectAll('line')
    .data(links.value)
    .join('line')
    .attr('stroke', 'rgba(156, 163, 175, 0.4)')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', d => Math.sqrt(d.value) * 1.5)
    .attr('marker-end', 'url(#arrowhead)')

  // Create node groups with improved styling
  const node = g.append('g')
    .selectAll('g')
    .data(nodes.value)
    .join('g')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))

  // Add circles to nodes with better visual hierarchy
  node.append('circle')
    .attr('r', d => 8 + d.group * 2) // Size based on group
    .attr('fill', d => d3.schemeTableau10[d.group]) // Using a better color scheme
    .attr('opacity', 0.8)

  // Add labels to nodes with improved visibility
  node.append('text')
    .attr('dx', d => 10 + d.group) // Position based on node size
    .attr('dy', '.35em')
    .text(d => d.name)
    .attr('font-size', '12px')
    .attr('fill', '#f3f4f6')
    .attr('text-shadow', '0 1px 3px rgba(0, 0, 0, 0.5)')

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
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 2px;
  transition: all 0.3s ease;
}

circle:hover {
  stroke: rgba(255, 255, 255, 0.3);
  stroke-width: 3px;
}

/* Link styling */
line {
  stroke-linecap: round;
  stroke: rgba(156, 163, 175, 0.4); /* gray-400 with opacity */
  transition: all 0.3s ease;
}

line:hover {
  stroke: rgba(156, 163, 175, 0.8);
}

/* Text styling */
text {
  fill: #f3f4f6; /* text-gray-100 */
  font-family: sans-serif;
  pointer-events: none;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}
</style> 