<template>
  <div class="container-xl">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <i class="bi bi-arrow-repeat me-2"></i>
          Synchronisation HubSpot CRM
        </h3>
      </div>

      <div class="card-body">
        <!-- Statut configuration -->
        <div v-if="status !== null" class="mb-4">
          <div v-if="!status.configured" class="alert alert-warning">
            <i class="bi bi-exclamation-triangle me-2"></i>
            HubSpot non configuré — renseignez <strong>HUBSPOT_TOKEN</strong> dans le <code>.env</code> backend.
          </div>
          <div v-else class="alert alert-success">
            <i class="bi bi-check-circle me-2"></i>
            HubSpot connecté
          </div>
        </div>

        <!-- Dernière synchronisation -->
        <div v-if="status?.last_sync" class="card card-sm mb-4">
          <div class="card-header">
            <h4 class="card-title">
              <i class="bi bi-clock-history me-2"></i>
              Dernière synchronisation
            </h4>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <strong>Date :</strong> {{ formatDate(status.last_sync.at) }}
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="card card-sm">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <span class="bg-success text-white avatar avatar-sm">
                          <i class="bi bi-person"></i>
                        </span>
                      </div>
                      <div class="col">
                        <div class="font-weight-medium">{{ status.last_sync.contacts }}</div>
                        <div class="text-secondary small">Contacts synchés</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card card-sm">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <span class="bg-info text-white avatar avatar-sm">
                          <i class="bi bi-building"></i>
                        </span>
                      </div>
                      <div class="col">
                        <div class="font-weight-medium">{{ status.last_sync.companies }}</div>
                        <div class="text-secondary small">Companies synchées</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card card-sm">
                  <div class="card-body">
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <span class="bg-danger text-white avatar avatar-sm">
                          <i class="bi bi-x-circle"></i>
                        </span>
                      </div>
                      <div class="col">
                        <div class="font-weight-medium">{{ status.last_sync.errors }}</div>
                        <div class="text-secondary small">Erreurs</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="status !== null" class="alert alert-info mb-4">
          <i class="bi bi-info-circle me-2"></i>
          Aucune synchronisation effectuée pour le moment.
        </div>

        <!-- Setup (1 seule fois) -->
        <div class="alert alert-warning mb-4">
          <div class="d-flex align-items-center">
            <div class="flex-fill">
              <h4 class="alert-title">
                <i class="bi bi-gear me-2"></i>
                Première utilisation
              </h4>
              <div class="text-secondary">
                Créer les propriétés personnalisées dans HubSpot (à faire une seule fois)
              </div>
            </div>
            <div class="ms-3">
              <button 
                class="btn btn-warning" 
                @click="runSetup" 
                :disabled="settingUp || !status?.configured"
              >
                <span v-if="settingUp" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-gear-fill me-2"></i>
                {{ settingUp ? 'Création en cours...' : 'Setup HubSpot' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Bouton sync manuelle -->
        <div class="d-flex align-items-center gap-3">
          <button 
            class="btn btn-primary" 
            @click="runSync" 
            :disabled="syncing || !status?.configured"
          >
            <span v-if="syncing" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-arrow-repeat me-2"></i>
            {{ syncing ? 'Synchronisation en cours...' : 'Synchroniser maintenant' }}
          </button>
          <span class="text-muted small">
            <i class="bi bi-moon me-1"></i>
            La sync automatique tourne chaque nuit à 02h00
          </span>
        </div>

        <!-- Sortie de la dernière sync manuelle -->
        <div v-if="syncOutput" class="mt-4">
          <div class="accordion" id="accordionSync">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button 
                  class="accordion-button collapsed" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#collapseSyncOutput"
                >
                  <i class="bi bi-code-square me-2"></i>
                  Sortie de la synchronisation
                </button>
              </h2>
              <div id="collapseSyncOutput" class="accordion-collapse collapse">
                <div class="accordion-body">
                  <pre class="bg-light p-3" style="font-size:12px;overflow:auto;max-height:300px;">{{ syncOutput }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div v-if="error || successMsg" class="card-footer">
        <div v-if="error" class="alert alert-danger mb-0">
          <i class="bi bi-exclamation-triangle me-2"></i>
          {{ error }}
        </div>
        <div v-if="successMsg" class="alert alert-success mb-0">
          <i class="bi bi-check-circle me-2"></i>
          {{ successMsg }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api.js'

const status     = ref(null)
const syncing    = ref(false)
const settingUp  = ref(false)
const syncOutput = ref('')
const error      = ref('')
const successMsg = ref('')

const formatDate = (iso) => iso ? new Date(iso).toLocaleString('fr-FR') : '-'

const loadStatus = async () => {
  try {
    const res = await api.get('/admin/hubspot/status')
    status.value = res.data
  } catch (err) {
    error.value = 'Impossible de charger le statut HubSpot'
  }
}

const runSetup = async () => {
  settingUp.value  = true
  error.value      = ''
  successMsg.value = ''
  syncOutput.value = ''
  try {
    const res = await api.post('/admin/hubspot/setup', {}, { timeout: 60000 })
    syncOutput.value = res.data.output
    successMsg.value = res.data.message + ' — vous pouvez maintenant lancer la synchronisation.'
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors du setup'
  } finally {
    settingUp.value = false
  }
}

const runSync = async () => {
  syncing.value    = true
  error.value      = ''
  successMsg.value = ''
  syncOutput.value = ''

  try {
    const res    = await api.post('/admin/hubspot/sync', {}, { timeout: 300000 })
    status.value = { ...status.value, last_sync: res.data.last_sync }
    syncOutput.value = res.data.output
    successMsg.value = res.data.message
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la synchronisation'
  } finally {
    syncing.value = false
  }
}

onMounted(loadStatus)
</script>
