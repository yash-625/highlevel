<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <div class="flex justify-between items-center mb-6">
        <h2 class="card-title">Audit Trail</h2>
        <div class="text-sm text-base-content/70">
          {{ auditLogs.length }} {{ auditLogs.length === 1 ? 'entry' : 'entries' }}
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-8">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <!-- Audit Logs Timeline -->
      <div v-else-if="auditLogs.length > 0" class="space-y-4">
        <div 
          v-for="(log, index) in auditLogs" 
          :key="log._id"
          class="relative"
        >
          <!-- Timeline connector -->
          <div 
            v-if="index < auditLogs.length - 1"
            class="absolute left-4 top-12 w-0.5 h-12 bg-base-300"
          ></div>

          <!-- Log Entry -->
          <div class="flex gap-4">
            <!-- Action Icon -->
            <div class="flex-shrink-0">
              <div :class="getActionIconClass(log.action)" class="w-8 h-8 rounded-full flex items-center justify-center">
                <component :is="getActionIcon(log.action)" class="w-4 h-4" />
              </div>
            </div>

            <!-- Log Content -->
            <div class="flex-1 min-w-0">
              <div class="bg-base-200 rounded-lg p-4">
                <!-- Header -->
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <div class="font-semibold">
                      {{ getActionDescription(log.action, log.entityType) }}
                    </div>
                    <div class="text-sm text-base-content/70">
                      by {{ log.performedByName }} • {{ formatDate(log.timestamp) }}
                    </div>
                  </div>
                  <div :class="getActionBadgeClass(log.action)" class="badge badge-sm">
                    {{ log.action }}
                  </div>
                </div>

                <!-- Changes Details -->
                <div v-if="log.changes && (log.changes.old || log.changes.new)" class="space-y-2">
                  <div class="text-sm font-medium text-base-content/80">Changes:</div>
                  
                  <!-- Field Changes -->
                  <div class="space-y-3">
                    <div 
                      v-for="(newValue, field) in log.changes.new" 
                      :key="field"
                      class="grid grid-cols-1 md:grid-cols-2 gap-2"
                    >
                      <div class="text-sm">
                        <div class="font-medium capitalize mb-1">{{ formatFieldName(field) }}:</div>
                        
                        <!-- Old Value -->
                        <div v-if="log.changes.old && log.changes.old[field] !== undefined" class="bg-red-50 border border-red-200 rounded px-2 py-1 mb-1">
                          <span class="text-xs text-red-600 font-medium">Before:</span>
                          <span class="text-sm text-red-800 ml-1">
                            {{ formatFieldValue(log.changes.old[field]) }}
                          </span>
                        </div>
                        
                        <!-- New Value -->
                        <div class="bg-green-50 border border-green-200 rounded px-2 py-1">
                          <span class="text-xs text-green-600 font-medium">After:</span>
                          <span class="text-sm text-green-800 ml-1">
                            {{ formatFieldValue(newValue) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Metadata -->
                <div v-if="log.metadata" class="mt-3 pt-3 border-t border-base-300">
                  <div class="text-xs text-base-content/50 space-y-1">
                    <div v-if="log.metadata.ipAddress">
                      IP Address: {{ log.metadata.ipAddress }}
                    </div>
                    <div v-if="log.metadata.description">
                      {{ log.metadata.description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="text-6xl mb-4">📋</div>
        <h3 class="text-xl font-semibold mb-2">No audit logs</h3>
        <p class="text-base-content/70">No changes have been recorded for this contact yet.</p>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.totalPages > 1" class="flex justify-center items-center gap-2 mt-6">
        <div class="join">
          <button 
            class="join-item btn btn-sm"
            :disabled="!pagination.hasPrevPage || loading"
            @click="loadPage(pagination.page - 1)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button class="join-item btn btn-sm btn-active">
            Page {{ pagination.page }} of {{ pagination.totalPages }}
          </button>
          
          <button 
            class="join-item btn btn-sm"
            :disabled="!pagination.hasNextPage || loading"
            @click="loadPage(pagination.page + 1)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue'
import { useContactStore } from '../stores/contact'

const props = defineProps({
  contactId: {
    type: String,
    required: true
  }
})

const contactStore = useContactStore()

const auditLogs = ref([])
const pagination = ref(null)
const loading = ref(false)

onMounted(async () => {
  await loadAuditLogs()
})

const loadAuditLogs = async (page = 1) => {
  try {
    loading.value = true
    const result = await contactStore.getAuditLogs(props.contactId, page)
    auditLogs.value = result.logs
    pagination.value = result.pagination
  } catch (error) {
    // Error handling is done in the store
  } finally {
    loading.value = false
  }
}

const loadPage = (page) => {
  loadAuditLogs(page)
}

const getActionIcon = (action) => {
  const iconMap = {
    create: () => h('svg', { 
      fill: 'none', 
      stroke: 'currentColor', 
      viewBox: '0 0 24 24',
      class: 'w-4 h-4'
    }, [
      h('path', { 
        'stroke-linecap': 'round', 
        'stroke-linejoin': 'round', 
        'stroke-width': '2', 
        d: 'M12 4v16m8-8H4' 
      })
    ]),
    update: () => h('svg', { 
      fill: 'none', 
      stroke: 'currentColor', 
      viewBox: '0 0 24 24',
      class: 'w-4 h-4'
    }, [
      h('path', { 
        'stroke-linecap': 'round', 
        'stroke-linejoin': 'round', 
        'stroke-width': '2', 
        d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' 
      })
    ]),
    delete: () => h('svg', { 
      fill: 'none', 
      stroke: 'currentColor', 
      viewBox: '0 0 24 24',
      class: 'w-4 h-4'
    }, [
      h('path', { 
        'stroke-linecap': 'round', 
        'stroke-linejoin': 'round', 
        'stroke-width': '2', 
        d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' 
      })
    ]),
    restore: () => h('svg', { 
      fill: 'none', 
      stroke: 'currentColor', 
      viewBox: '0 0 24 24',
      class: 'w-4 h-4'
    }, [
      h('path', { 
        'stroke-linecap': 'round', 
        'stroke-linejoin': 'round', 
        'stroke-width': '2', 
        d: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' 
      })
    ])
  }
  
  return iconMap[action] || iconMap.update
}

const getActionIconClass = (action) => {
  const classMap = {
    create: 'bg-success text-success-content',
    update: 'bg-info text-info-content',
    delete: 'bg-error text-error-content',
    restore: 'bg-warning text-warning-content'
  }
  
  return classMap[action] || 'bg-base-300 text-base-content'
}

const getActionBadgeClass = (action) => {
  const classMap = {
    create: 'badge-success',
    update: 'badge-info',
    delete: 'badge-error',
    restore: 'badge-warning'
  }
  
  return classMap[action] || 'badge-ghost'
}

const getActionDescription = (action, entityType) => {
  const descriptions = {
    create: {
      contact: 'Contact created',
      note: 'Note added',
      user: 'User created'
    },
    update: {
      contact: 'Contact updated',
      note: 'Note updated',
      user: 'User updated'
    },
    delete: {
      contact: 'Contact deleted',
      note: 'Note deleted',
      user: 'User deleted'
    },
    restore: {
      contact: 'Contact restored',
      note: 'Note restored',
      user: 'User restored'
    }
  }
  
  return descriptions[action]?.[entityType] || `${entityType} ${action}d`
}

const formatFieldName = (field) => {
  return field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

const formatFieldValue = (value) => {
  if (value === null || value === undefined) {
    return 'Not set'
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }
  if (typeof value === 'string' && value.trim() === '') {
    return 'Empty'
  }
  return String(value)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
</script>