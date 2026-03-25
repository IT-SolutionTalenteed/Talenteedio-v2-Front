<template>
  <div>
    <h2>Synchronisation HubSpot CRM</h2>

    <!-- Statut configuration -->
    <div v-if="status !== null">
      <p v-if="!status.configured" style="color:orange;">
        HubSpot non configuré — renseignez <strong>HUBSPOT_TOKEN</strong> dans le <code>.env</code> backend.
      </p>
      <p v-else style="color:green;">HubSpot connecté</p>
    </div>

    <!-- Dernière synchronisation -->
    <div v-if="status?.last_sync" style="margin:16px 0;border:1px solid #ccc;padding:12px;">
      <h3>Dernière synchronisation</h3>
      <p>Date : {{ formatDate(status.last_sync.at) }}</p>
      <table>
        <thead>
          <tr>
            <th>Contacts synchés</th>
            <th>Companies synchées</th>
            <th>Erreurs</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="color:green;">{{ status.last_sync.contacts }}</td>
            <td style="color:green;">{{ status.last_sync.companies }}</td>
            <td style="color:red;">{{ status.last_sync.errors }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="status !== null" style="margin:16px 0;color:#888;">
      Aucune synchronisation effectuée pour le moment.
    </div>

    <!-- Setup (1 seule fois) -->
    <div style="margin-top:16px;padding:12px;border:1px solid #e0b000;background:#fffbe6;">
      <strong>Première utilisation</strong> — Créer les propriétés personnalisées dans HubSpot :
      <button @click="runSetup" :disabled="settingUp || !status?.configured" style="margin-left:12px;">
        {{ settingUp ? 'Création en cours...' : 'Setup HubSpot (1 fois)' }}
      </button>
    </div>

    <!-- Bouton sync manuelle -->
    <div style="margin-top:16px;">
      <button @click="runSync" :disabled="syncing || !status?.configured">
        {{ syncing ? 'Synchronisation en cours...' : 'Synchroniser maintenant' }}
      </button>
      <span style="margin-left:12px;color:#888;font-size:13px;">
        La sync automatique tourne chaque nuit à 02h00.
      </span>
    </div>

    <!-- Sortie de la dernière sync manuelle -->
    <div v-if="syncOutput" style="margin-top:16px;">
      <details>
        <summary>Sortie de la synchronisation</summary>
        <pre style="background:#f5f5f5;padding:12px;font-size:12px;overflow:auto;max-height:300px;">{{ syncOutput }}</pre>
      </details>
    </div>

    <div v-if="error" style="color:red;margin-top:12px;">{{ error }}</div>
    <div v-if="successMsg" style="color:green;margin-top:12px;">{{ successMsg }}</div>
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
