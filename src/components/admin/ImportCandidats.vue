<template>
  <div class="container-xl">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <i class="bi bi-upload me-2"></i>
          Import Candidats (XLS)
        </h3>
      </div>

      <div class="card-body">
        <div class="alert alert-info mb-4">
          <i class="bi bi-info-circle me-2"></i>
          Importez le fichier <strong>candidats.xls</strong> de l'ancien CRM pour créer les comptes talents dans Talenteed.
        </div>

        <form @submit.prevent="launch">
          <div class="mb-3">
            <label class="form-label required">Fichier XLS</label>
            <input 
              type="file" 
              class="form-control" 
              accept=".xls,.xlsx" 
              @change="e => file = e.target.files[0]" 
              required 
            />
            <small class="form-hint">Formats acceptés : .xls, .xlsx</small>
          </div>

          <div class="mb-3">
            <label class="form-check">
              <input type="checkbox" class="form-check-input" v-model="dryRun" />
              <span class="form-check-label">
                <strong>Simulation (dry-run)</strong> — ne crée rien, affiche seulement les résultats
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary" 
            :disabled="!file || loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-upload me-2"></i>
            {{ loading ? 'Import en cours...' : (dryRun ? 'Simuler l\'import' : 'Lancer l\'import') }}
          </button>
        </form>
      </div>

      <!-- Résultats -->
      <div v-if="result" class="card-body border-top">
        <h4 class="mb-3">
          <i class="bi bi-check-circle text-success me-2"></i>
          Résultats {{ result.dry_run ? '(simulation)' : '' }}
        </h4>

        <div class="row mb-3">
          <div class="col-sm-6 col-lg-3">
            <div class="card card-sm">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <span class="bg-success text-white avatar">
                      <i class="bi bi-check-lg"></i>
                    </span>
                  </div>
                  <div class="col">
                    <div class="font-weight-medium">{{ result.stats.created }}</div>
                    <div class="text-secondary">Créés</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-sm-6 col-lg-3">
            <div class="card card-sm">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <span class="bg-secondary text-white avatar">
                      <i class="bi bi-dash-circle"></i>
                    </span>
                  </div>
                  <div class="col">
                    <div class="font-weight-medium">{{ result.stats.skipped }}</div>
                    <div class="text-secondary">Ignorés (internes)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-sm-6 col-lg-3">
            <div class="card card-sm">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <span class="bg-warning text-white avatar">
                      <i class="bi bi-exclamation-triangle"></i>
                    </span>
                  </div>
                  <div class="col">
                    <div class="font-weight-medium">{{ result.stats.existing }}</div>
                    <div class="text-secondary">Déjà existants</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-sm-6 col-lg-3">
            <div class="card card-sm">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <span class="bg-danger text-white avatar">
                      <i class="bi bi-x-circle"></i>
                    </span>
                  </div>
                  <div class="col">
                    <div class="font-weight-medium">{{ result.stats.errors }}</div>
                    <div class="text-secondary">Erreurs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="result.dry_run" class="alert alert-warning">
          <i class="bi bi-info-circle me-2"></i>
          Mode simulation — aucun compte créé. Relancez sans "Simulation" pour importer réellement.
        </div>

        <div class="accordion" id="accordionOutput">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button 
                class="accordion-button collapsed" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#collapseOutput"
              >
                <i class="bi bi-code-square me-2"></i>
                Voir la sortie complète
              </button>
            </h2>
            <div id="collapseOutput" class="accordion-collapse collapse">
              <div class="accordion-body">
                <pre class="bg-light p-3" style="font-size:12px;overflow:auto;max-height:400px;">{{ result.output }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="error" class="card-footer">
        <div class="alert alert-danger mb-0">
          <i class="bi bi-exclamation-triangle me-2"></i>
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../../services/api.js'

const file    = ref(null)
const dryRun  = ref(true)
const loading = ref(false)
const result  = ref(null)
const error   = ref('')

const launch = async () => {
  loading.value = true
  error.value   = ''
  result.value  = null

  try {
    const fd = new FormData()
    fd.append('file', file.value)
    fd.append('dry_run', dryRun.value ? '1' : '0')

    const res = await api.post('/admin/import/candidats', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000, // 5 minutes — l'import peut être long
    })
    result.value = res.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de l\'import'
  } finally {
    loading.value = false
  }
}
</script>
