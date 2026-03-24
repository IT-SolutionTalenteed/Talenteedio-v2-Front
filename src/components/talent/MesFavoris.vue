<template>
  <div>
    <h2>Mes offres favorites</h2>

    <div v-if="offres.length > 0">
      <div v-for="offre in offres" :key="offre.id" style="border:1px solid #ccc; margin:8px; padding:12px;">
        <h3>{{ offre.titre }}</h3>
        <p v-if="offre.entreprise"><strong>Entreprise :</strong> {{ offre.entreprise.nom }}</p>
        <p v-if="offre.localisation"><strong>Lieu :</strong> {{ offre.localisation }}</p>
        <p v-if="offre.fourchette_salariale"><strong>Salaire :</strong> {{ offre.fourchette_salariale }}</p>
        <button @click="retirer(offre)">Retirer des favoris</button>
      </div>
    </div>
    <div v-else-if="!loading"><p>Aucune offre en favori.</p></div>

    <div v-if="error" style="color:red;">{{ error }}</div>
    <div v-if="success" style="color:green;">{{ success }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import offreService from '../../services/talent/offreService.js'

const offres = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')

const load = async () => {
  loading.value = true
  try { const res = await offreService.getFavoris(); offres.value = res.data }
  catch { error.value = 'Erreur chargement' }
  finally { loading.value = false }
}

const retirer = async (offre) => {
  try {
    await offreService.toggleFavori(offre.id)
    offres.value = offres.value.filter(o => o.id !== offre.id)
    success.value = 'Retiré des favoris'
  } catch { error.value = 'Erreur' }
}

onMounted(load)
</script>
