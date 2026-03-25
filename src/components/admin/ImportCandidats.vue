<template>
  <div>
    <h2>Import Candidats (XLS)</h2>
    <p>Importez le fichier <strong>candidats.xls</strong> de l'ancien CRM pour créer les comptes talents dans Talenteed.</p>

    <form @submit.prevent="launch">
      <div>
        <label>Fichier XLS *</label>
        <input type="file" accept=".xls,.xlsx" @change="e => file = e.target.files[0]" required />
      </div>

      <div>
        <label>
          <input type="checkbox" v-model="dryRun" />
          Simulation (dry-run) — ne crée rien, affiche seulement les résultats
        </label>
      </div>

      <div>
        <button type="submit" :disabled="!file || loading">
          {{ loading ? 'Import en cours...' : (dryRun ? 'Simuler' : 'Lancer l\'import') }}
        </button>
      </div>
    </form>

    <!-- Résultats -->
    <div v-if="result" style="margin-top:24px;border-top:1px solid #ccc;padding-top:16px;">
      <h3>Résultats {{ result.dry_run ? '(simulation)' : '' }}</h3>

      <table>
        <thead>
          <tr>
            <th>Créés</th>
            <th>Ignorés (internes)</th>
            <th>Déjà existants</th>
            <th>Erreurs</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="color:green;font-weight:bold;">{{ result.stats.created }}</td>
            <td>{{ result.stats.skipped }}</td>
            <td style="color:orange;">{{ result.stats.existing }}</td>
            <td style="color:red;">{{ result.stats.errors }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="result.dry_run" style="color:orange;margin-top:8px;">
        Mode simulation — aucun compte créé. Relancez sans "Simulation" pour importer réellement.
      </div>

      <details style="margin-top:16px;">
        <summary>Voir la sortie complète</summary>
        <pre style="background:#f5f5f5;padding:12px;font-size:12px;overflow:auto;max-height:400px;">{{ result.output }}</pre>
      </details>
    </div>

    <div v-if="error" style="color:red;margin-top:12px;">{{ error }}</div>
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
