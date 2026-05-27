<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12" lg="11" xl="9" class="mx-auto">

        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-h4 font-weight-bold mb-2">
            <v-icon icon="mdi-email-sync" size="32" class="mr-2" color="blue-darken-2"></v-icon>
            Synchronisation Brevo CRM
          </h1>
          <p class="text-body-1 text-medium-emphasis">
            Gérez la synchronisation des Talents et Entreprises vers Brevo
          </p>
        </div>

        <!-- Statut configuration -->
        <v-alert v-if="status !== null && !status.configured" type="warning" variant="tonal" class="mb-6" icon="mdi-alert">
          Brevo non configuré — renseignez <strong>BREVO_API_KEY</strong> dans le <code>.env</code> backend.
        </v-alert>
        <v-alert v-else-if="status !== null && status.configured" type="success" variant="tonal" class="mb-6" icon="mdi-check-circle">
          Brevo connecté et prêt
        </v-alert>

        <!-- Dernière sync -->
        <v-card v-if="status?.last_sync" elevation="2" class="mb-6">
          <v-card-title class="pa-6 bg-blue-lighten-5">
            <v-icon icon="mdi-clock-outline" class="mr-2"></v-icon>
            Dernière synchronisation
          </v-card-title>
          <v-card-text class="pa-6">
            <div class="text-subtitle-1 mb-4"><strong>Date :</strong> {{ formatDate(status.last_sync.at) }}</div>
            <v-row>
              <v-col cols="12" md="3">
                <v-card variant="tonal" color="success">
                  <v-card-text>
                    <div class="d-flex align-center">
                      <v-avatar color="success" size="56" class="mr-4"><v-icon icon="mdi-account" size="32" color="white"></v-icon></v-avatar>
                      <div>
                        <div class="text-h4 font-weight-bold">{{ status.last_sync.contacts }}</div>
                        <div class="text-caption">Contacts synchés</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="3">
                <v-card variant="tonal" color="info">
                  <v-card-text>
                    <div class="d-flex align-center">
                      <v-avatar color="info" size="56" class="mr-4"><v-icon icon="mdi-office-building" size="32" color="white"></v-icon></v-avatar>
                      <div>
                        <div class="text-h4 font-weight-bold">{{ status.last_sync.entreprises }}</div>
                        <div class="text-caption">Entreprises synchées</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="3">
                <v-card variant="tonal" color="warning">
                  <v-card-text>
                    <div class="d-flex align-center">
                      <v-avatar color="warning" size="56" class="mr-4"><v-icon icon="mdi-skip-next" size="32" color="white"></v-icon></v-avatar>
                      <div>
                        <div class="text-h4 font-weight-bold">{{ status.last_sync.skipped ?? 0 }}</div>
                        <div class="text-caption">Sans email (ignorées)</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="3">
                <v-card variant="tonal" color="error">
                  <v-card-text>
                    <div class="d-flex align-center">
                      <v-avatar color="error" size="56" class="mr-4"><v-icon icon="mdi-alert-circle" size="32" color="white"></v-icon></v-avatar>
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

        <!-- Setup -->
        <v-card elevation="2" class="mb-6" color="warning-lighten-5">
          <v-card-text class="pa-6">
            <div class="d-flex align-center">
              <v-avatar color="warning" size="56" class="mr-4"><v-icon icon="mdi-cog" size="32" color="white"></v-icon></v-avatar>
              <div class="flex-grow-1">
                <h3 class="text-h6 font-weight-bold mb-1">Première utilisation</h3>
                <p class="text-body-2 text-medium-emphasis mb-0">Créer les attributs personnalisés dans Brevo (à faire une seule fois)</p>
              </div>
              <v-btn color="warning" size="large" @click="runSetup" :disabled="settingUp || !status?.configured" :loading="settingUp">
                <v-icon start>mdi-cog</v-icon>
                Setup Brevo
              </v-btn>
            </div>
            <v-expansion-panels v-if="setupOutput" class="mt-4">
              <v-expansion-panel>
                <v-expansion-panel-title><v-icon icon="mdi-code-braces" class="mr-2"></v-icon>Sortie setup</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <pre class="pa-4 bg-grey-lighten-4 rounded" style="font-size:12px;overflow:auto;max-height:200px;">{{ setupOutput }}</pre>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>

        <!-- Filtres -->
        <v-card elevation="2" class="mb-4">
          <v-card-text class="pa-4">
            <v-row align="center" class="ga-2">
              <v-col cols="12" md="3">
                <v-select v-model="filterType" :items="typeOptions" label="Type" density="compact" variant="outlined" hide-details></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select v-model="filterStatus" :items="statusOptions" label="Statut Brevo" density="compact" variant="outlined" hide-details></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="search" label="Rechercher (nom, email)" density="compact" variant="outlined" hide-details prepend-inner-icon="mdi-magnify" clearable></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-chip prepend-icon="mdi-moon-waning-crescent" color="info" variant="tonal" size="small">
                  Cron 02h30
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Table multi-select -->
        <v-card elevation="2" class="mb-6">
          <v-card-text class="pa-0">
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="filteredContacts"
              item-value="key"
              show-select
              :loading="loading"
              class="elevation-0"
            >
              <template #item.type="{ item }">
                <v-chip :color="item.type === 'talent' ? 'purple' : 'blue'" size="small" variant="tonal">
                  {{ item.type }}
                </v-chip>
              </template>

              <template #item.brevo_status="{ item }">
                <v-chip v-if="item.sync_error" color="error" size="small" variant="tonal" :title="item.sync_error">
                  <v-icon start size="14">mdi-alert-circle</v-icon>erreur
                </v-chip>
                <v-chip v-else-if="item.brevo_id" color="success" size="small" variant="tonal">
                  <v-icon start size="14">mdi-check-circle</v-icon>{{ formatDateShort(item.synced_at) }}
                </v-chip>
                <v-chip v-else color="grey" size="small" variant="tonal">
                  <v-icon start size="14">mdi-minus-circle</v-icon>jamais
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>

          <v-card-actions class="pa-4 ga-3">
            <v-btn
              color="primary"
              :disabled="selected.length === 0 || syncing"
              :loading="syncing"
              @click="syncSelected"
            >
              <v-icon start>mdi-sync</v-icon>
              Synchroniser la sélection ({{ selected.length }})
            </v-btn>

            <v-btn
              color="secondary"
              variant="tonal"
              :disabled="syncingAll || !status?.configured"
              :loading="syncingAll"
              @click="syncAll"
            >
              <v-icon start>mdi-sync-alert</v-icon>
              Tout synchroniser
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Messages -->
        <v-alert v-if="error" type="error" variant="tonal" closable class="mb-4" @click:close="error = ''">{{ error }}</v-alert>
        <v-alert v-if="successMsg" type="success" variant="tonal" closable @click:close="successMsg = ''">{{ successMsg }}</v-alert>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import brevoService from '../../services/admin/brevoService.js'

const status     = ref(null)
const loading    = ref(false)
const syncing    = ref(false)
const syncingAll = ref(false)
const settingUp  = ref(false)
const selected   = ref([])
const search     = ref('')
const filterType   = ref('tous')
const filterStatus = ref('tous')
const setupOutput  = ref('')
const error        = ref('')
const successMsg   = ref('')

const typeOptions   = ['tous', 'talent', 'entreprise']
const statusOptions = ['tous', 'synced', 'erreur', 'jamais']

const headers = [
  { title: 'Nom',    key: 'name',         sortable: true },
  { title: 'Email',  key: 'email',        sortable: true },
  { title: 'Type',   key: 'type',         sortable: true },
  { title: 'Brevo',  key: 'brevo_status', sortable: false },
]

const allContacts = computed(() =>
  (status.value?.contacts ?? []).map(c => ({ ...c, key: `${c.type}-${c.id}` }))
)

const filteredContacts = computed(() => {
  return allContacts.value.filter(c => {
    if (filterType.value !== 'tous' && c.type !== filterType.value) return false
    if (filterStatus.value === 'synced'   && (!c.brevo_id || c.sync_error)) return false
    if (filterStatus.value === 'erreur'   && !c.sync_error) return false
    if (filterStatus.value === 'jamais'   && (c.brevo_id || c.sync_error)) return false
    if (search.value) {
      const q = search.value.toLowerCase()
      if (!c.name?.toLowerCase().includes(q) && !c.email?.toLowerCase().includes(q)) return false
    }
    return true
  })
})

const formatDate      = (iso) => iso ? new Date(iso).toLocaleString('fr-FR') : '-'
const formatDateShort = (iso) => iso ? new Date(iso).toLocaleDateString('fr-FR') : '-'

const loadStatus = async () => {
  loading.value = true
  try {
    const res = await brevoService.getStatus()
    status.value = res.data
  } catch {
    error.value = 'Impossible de charger le statut Brevo'
  } finally {
    loading.value = false
  }
}

const runSetup = async () => {
  settingUp.value = true
  error.value = ''
  try {
    const res = await brevoService.setup()
    setupOutput.value = res.data.output
    successMsg.value = res.data.message
  } catch {
    error.value = 'Erreur lors du setup Brevo'
  } finally {
    settingUp.value = false
  }
}

const syncSelected = async () => {
  syncing.value = true
  error.value = ''
  successMsg.value = ''
  try {
    const items = selected.value.map(key => {
      const [type, ...idParts] = key.split('-')
      return { type, id: Number(idParts.join('-')) }
    })
    const res = await brevoService.sync(items)
    successMsg.value = res.data.message
    selected.value = []
    await loadStatus()
  } catch {
    error.value = 'Erreur lors de la synchronisation de la sélection'
  } finally {
    syncing.value = false
  }
}

const syncAll = async () => {
  syncingAll.value = true
  error.value = ''
  successMsg.value = ''
  try {
    const res = await brevoService.syncAll()
    status.value = { ...status.value, last_sync: res.data.last_sync }
    successMsg.value = res.data.message
    await loadStatus()
  } catch {
    error.value = 'Erreur lors de la synchronisation complète'
  } finally {
    syncingAll.value = false
  }
}

onMounted(loadStatus)
</script>

<style scoped>
.bg-blue-lighten-5 { background-color: rgba(33, 150, 243, 0.08); }
.warning-lighten-5 { background-color: rgba(255, 152, 0, 0.08); }
</style>
