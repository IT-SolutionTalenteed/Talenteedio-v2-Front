<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12" lg="10" xl="8" class="mx-auto">
        
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-h4 font-weight-bold mb-2">
            <v-icon icon="mdi-upload" size="32" class="mr-2"></v-icon>
            Import Candidats
          </h1>
          <p class="text-body-1 text-medium-emphasis">
            Importez le fichier XLS de l'ancien CRM pour créer les comptes talents
          </p>
        </div>

        <!-- Formulaire -->
        <v-card elevation="2" class="mb-6">
          <v-card-text class="pa-6">
            <v-alert
              type="info"
              variant="tonal"
              class="mb-6"
              icon="mdi-information"
            >
              Importez le fichier <strong>candidats.xls</strong> de l'ancien CRM pour créer les comptes talents dans Talenteed.
            </v-alert>

            <v-form @submit.prevent="launch">
              <v-file-input
                v-model="fileArray"
                label="Fichier XLS"
                accept=".xls,.xlsx"
                prepend-icon="mdi-file-excel"
                variant="outlined"
                hint="Formats acceptés : .xls, .xlsx"
                persistent-hint
                required
                class="mb-4"
                :disabled="loading"
              ></v-file-input>

              <v-checkbox
                v-model="dryRun"
                color="primary"
                class="mb-4"
              >
                <template v-slot:label>
                  <div>
                    <strong>Simulation (dry-run)</strong>
                    <div class="text-caption text-medium-emphasis">
                      Ne crée rien, affiche seulement les résultats
                    </div>
                  </div>
                </template>
              </v-checkbox>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                :disabled="!fileArray.length || loading"
                :loading="loading"
              >
                <v-icon start>{{ dryRun ? 'mdi-play-circle-outline' : 'mdi-upload' }}</v-icon>
                {{ loading ? 'Import en cours...' : (dryRun ? 'Simuler l\'import' : 'Lancer l\'import') }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Résultats -->
        <v-card v-if="result" elevation="2" class="mb-6">
          <v-card-title class="d-flex align-center pa-6 bg-success-lighten">
            <v-icon icon="mdi-check-circle" color="success" class="mr-2"></v-icon>
            <span>Résultats {{ result.dry_run ? '(simulation)' : '' }}</span>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-card variant="tonal" color="success">
                  <v-card-text>
                    <div class="d-flex align-center">
                      <v-avatar color="success" size="48" class="mr-3">
                        <v-icon icon="mdi-check" color="white"></v-icon>
                      </v-avatar>
                      <div>
                        <div class="text-h5 font-weight-bold">{{ result.stats.created }}</div>
                        <div class="text-caption">Créés</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-card variant="tonal" color="grey">
                  <v-card-text>
                    <div class="d-flex align-center">
                      <v-avatar color="grey" size="48" class="mr-3">
                        <v-icon icon="mdi-minus-circle" color="white"></v-icon>
                      </v-avatar>
                      <div>
                        <div class="text-h5 font-weight-bold">{{ result.stats.skipped }}</div>
                        <div class="text-caption">Ignorés</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-card variant="tonal" color="warning">
                  <v-card-text>
                    <div class="d-flex align-center">
                      <v-avatar color="warning" size="48" class="mr-3">
                        <v-icon icon="mdi-alert" color="white"></v-icon>
                      </v-avatar>
                      <div>
                        <div class="text-h5 font-weight-bold">{{ result.stats.existing }}</div>
                        <div class="text-caption">Existants</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-card variant="tonal" color="error">
                  <v-card-text>
                    <div class="d-flex align-center">
                      <v-avatar color="error" size="48" class="mr-3">
                        <v-icon icon="mdi-close-circle" color="white"></v-icon>
                      </v-avatar>
                      <div>
                        <div class="text-h5 font-weight-bold">{{ result.stats.errors }}</div>
                        <div class="text-caption">Erreurs</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-alert
              v-if="result.dry_run"
              type="warning"
              variant="tonal"
              class="mt-6"
              icon="mdi-information"
            >
              Mode simulation — aucun compte créé. Relancez sans "Simulation" pour importer réellement.
            </v-alert>

            <v-expansion-panels class="mt-6">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon icon="mdi-code-braces" class="mr-2"></v-icon>
                  Voir la sortie complète
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <pre class="pa-4 bg-grey-lighten-4 rounded" style="font-size:12px;overflow:auto;max-height:400px;">{{ result.output }}</pre>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>

        <!-- Erreur -->
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          closable
          @click:close="error = ''"
        >
          {{ error }}
        </v-alert>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '../../services/api.js'

const fileArray = ref([])
const file = computed(() => fileArray.value[0] || null)
const dryRun  = ref(true)
const loading = ref(false)
const result  = ref(null)
const error   = ref('')

const launch = async () => {
  if (!file.value) return
  
  loading.value = true
  error.value   = ''
  result.value  = null

  try {
    const fd = new FormData()
    fd.append('file', file.value)
    fd.append('dry_run', dryRun.value ? '1' : '0')

    const res = await api.post('/admin/import/candidats', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    })
    result.value = res.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de l\'import'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-success-lighten {
  background-color: rgba(76, 175, 80, 0.1);
}
</style>
