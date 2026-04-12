<template>
  <div>
    <div v-if="resultats?.length > 0">
      <v-card
        v-for="(r, i) in resultats"
        :key="r.entreprise_id"
        variant="outlined"
        class="mb-3 pa-4"
        :style="i === 0 ? 'border-color: rgba(255,111,0,0.5); border-width:1.5px' : ''"
      >
        <div class="d-flex align-start justify-space-between">
          <div class="flex-grow-1">
            <div class="d-flex align-center gap-2 mb-1">
              <span class="text-h6">{{ rankEmoji(i) }}</span>
              <span class="text-subtitle-1 font-weight-bold">{{ r.nom }}</span>
            </div>
            <div class="text-caption text-medium-emphasis mb-1">
              <span v-if="r.ville">📍 {{ r.ville }}<span v-if="r.pays">, {{ r.pays }}</span></span>
              <span v-if="r.secteur" class="ml-2">🏭 {{ r.secteur }}</span>
            </div>
            <p class="text-body-2 text-medium-emphasis mt-2">{{ r.raison }}</p>
          </div>
          <div class="text-center ml-4" style="min-width:56px">
            <div class="text-h5 font-weight-black" :class="scoreClass(r.score)">{{ r.score }}</div>
            <div class="text-caption text-medium-emphasis">/100</div>
            <v-progress-linear :model-value="r.score" :color="scoreColor(r.score)" rounded height="4" class="mt-1" />
          </div>
        </div>

        <!-- Offres matchées -->
        <div v-if="r.offres_matchees?.length" class="mt-3 pa-2 rounded" style="background:rgba(0,0,0,0.04)">
          <div class="text-caption font-weight-medium text-medium-emphasis mb-1">
            <v-icon size="13">mdi-briefcase-outline</v-icon> Offres correspondantes
          </div>
          <div
            v-for="o in r.offres_matchees"
            :key="o.offre_id"
            class="d-flex align-center justify-space-between py-1"
          >
            <span class="text-body-2">{{ o.titre }}</span>
            <v-chip size="x-small" :color="scoreColor(o.score_offre)" label>{{ o.score_offre }}/100</v-chip>
          </div>
        </div>

        <v-btn
          size="small" variant="tonal" color="primary" class="mt-3"
          @click="$emit('demanderRdv', r.entreprise_id, r.nom, evenement)"
        >
          <v-icon size="14" class="mr-1">mdi-calendar-check</v-icon>
          Prendre rendez-vous
        </v-btn>
      </v-card>
    </div>
    <v-alert v-else type="info" variant="tonal">Aucun résultat de matching.</v-alert>
  </div>
</template>

<script setup>
defineProps({
  resultats: { type: Array, default: () => [] },
  evenement: { type: Object, default: null },
})
defineEmits(['demanderRdv'])

const rankEmoji = (i) => ['🥇', '🥈', '🥉'][i] ?? `#${i + 1}`
const scoreColor = (s) => s >= 75 ? 'success' : s >= 50 ? 'warning' : 'error'
const scoreClass = (s) => s >= 75 ? 'text-success' : s >= 50 ? 'text-warning' : 'text-error'
</script>
