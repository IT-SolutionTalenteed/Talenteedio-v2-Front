<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12" lg="10" xl="8" class="mx-auto">
        
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-h4 font-weight-bold mb-2">
            <v-icon icon="mdi-sync" size="32" class="mr-2"></v-icon>
            Synchronisation HubSpot CRM
          </h1>
          <p class="text-body-1 text-medium-emphasis">
            Gérez la synchronisation bidirectionnelle avec HubSpot
          </p>
        </div>

        <!-- Statut configuration -->
        <v-alert
          v-if="status !== null && !status.configured"
          type="warning"
          variant="tonal"
          class="mb-6"
          icon="mdi-alert"
        >
          HubSpot non configuré — renseignez <strong>HUBSPOT_TOKEN</strong> dans le <code>.env</code> backend.
        </v-alert>

        <v-alert
          v-else-if="status !== null && status.configured"
          type="success"
          variant="tonal"
          class="mb-6"
          icon="mdi-check-circle"
        >
          HubSpot connecté et prêt
        </v-alert>

        <!-- Dernière synchronisation -->
        <v-card v-if="status?.last_sync" elevation="2" class="mb-6">
          <v-card-title class="pa-6 bg-blue-lighten-5">
            <v-icon icon="mdi-clock-outline" class="mr-2"></v-icon>
            Dernière synchronisation
          </v-card-title>
          
          <v-card-text class="pa-6">
            <div class="text-subtitle-1 mb-4">
              <strong>Date :</strong> {{ formatDate(status.last_sync.at) }}
            </div>

            <v-row>
              <v-col cols="12" md="4">
                <v-card variant="tonal" color="success">
                  <v-card-text>
                    <div class="d-flex align-center">
                      <v-avatar color="success" size="56" class="mr-4">
                        <v-icon icon="mdi-account" size="32" color="white"></v-icon>
                      </v-avatar>
                      <div>
                        <div class="text-h4 font-weight-bold">{{ status.last_sync.contacts }}</div>
                        <div class="text-caption">Contacts synchés</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="4">
                <v-card variant="tonal" color="info">
                  <v-card-text>
                    <div class="d-flex align-center">
                      <v-avatar color="info" size="56" class="mr-4">
                        <v-icon icon="mdi-office-building" size="32" color="white"></v-icon>
                      </v-avatar>
                      <div>
                        <div class="text-h4 font-weight-bold">{{ status.last_sync.companies }}</div>
                        <div class="text-caption">Companies synchées</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="4">
                <v-card variant="tonal" color="error">
                  <v-card-text>
                    <div class="d-flex align-center">
                      <v-avatar color="error" size="56" class="mr-4">
                        <v-icon icon="mdi-alert-circle" size="32" color="white"></v-icon>
                      </v-avatar>
                      <div>
                        <div class="text-h4 font-weight-bold">{{ status.last_sync.errors }}</div>
                        <div class="text-caption">Erreurs</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-alert
          v-else-if="status !== null"
          type="info"
          variant="tonal"
          class="mb-6"
          icon="mdi-information"
        >
          Aucune synchronisation effectuée pour le moment.
        </v-alert>

        <!-- Setup -->
        <v-card elevation="2" class="mb-6" color="warning-lighten-5">
          <v-card-text class="pa-6">
            <div class="d-flex align-center">
              <v-avatar color="warning" size="56" class="mr-4">
                <v-icon icon="mdi-cog" size="32" color="white"></v-icon>
              </v-avatar>
              <div class="flex-grow-1">
                <h3 class="text-h6 font-weight-bold mb-1">Première utilisation</h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Créer les propriétés personnalisées dans HubSpot (à faire une seule fois)
                </p>
              </div>
              <v-btn
                color="warning"
                size="large"
                @click="runSetup"
                :disabled="settingUp || !status?.configured"
                :loading="settingUp"
              >
                <v-icon start>mdi-cog</v-icon>
                Setup HubSpot
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Actions de synchronisation -->
        <v-card elevation="2" class="mb-6">
          <v-card-text class="pa-6">
            <div class="d-flex align-center flex-wrap ga-4">
              <v-btn
                color="primary"
                size="x-large"
                @click="runSync"
                :disabled="syncing || !status?.configured"
                :loading="syncing"
              >
                <v-icon start>mdi-sync</v-icon>
                Synchroniser maintenant
              </v-btn>

              <v-chip
                prepend-icon="mdi-moon-waning-crescent"
                color="info"
                variant="tonal"
              >
                Sync automatique chaque nuit à 02h00
              </v-chip>
            </div>

            <!-- Sortie de la dernière sync -->
            <v-expansion-panels v-if="syncOutput" class="mt-6">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon icon="mdi-code-braces" class="mr-2"></v-icon>
                  Sortie de la synchronisation
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <pre class="pa-4 bg-grey-lighten-4 rounded" style="font-size:12px;overflow:auto;max-height:300px;">{{ syncOutput }}</pre>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>

        <!-- Messages -->
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          closable
          class="mb-4"
          @click:close="error = ''"
        >
          {{ error }}
        </v-alert>

        <v-alert
          v-if="successMsg"
          type="success"
          variant="tonal"
          closable
          @click:close="successMsg = ''"
        >
          {{ successMsg }}
        </v-alert>

      </v-col>
    </v-row>
  </v-container>
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

<style scoped>
.bg-blue-lighten-5 {
  background-color: rgba(33, 150, 243, 0.08);
}
.warning-lighten-5 {
  background-color: rgba(255, 152, 0, 0.08);
}
</style>
