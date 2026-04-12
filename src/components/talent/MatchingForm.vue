<template>
  <div>
    <!-- Poste recherché -->
    <v-text-field
      :model-value="modelValue.poste_recherche"
      @update:model-value="emit('update:modelValue', { ...modelValue, poste_recherche: $event })"
      label="Poste recherché *"
      variant="outlined"
      density="comfortable"
      placeholder="Ex: Développeur Full Stack, Data Analyst..."
      class="mb-3"
      required
    />

    <!-- Upload CV + extraction automatique compétences -->
    <div class="mb-4">
      <div class="text-body-2 font-weight-medium mb-1">
        CV (PDF, DOC, DOCX — optionnel)
        <v-chip v-if="parsingCv" size="x-small" color="primary" class="ml-2">
          <v-progress-circular indeterminate size="10" width="2" class="mr-1" />
          Extraction des compétences…
        </v-chip>
        <v-chip v-else-if="modelValue.cvFile" size="x-small" color="success" class="ml-2">
          <v-icon size="12" class="mr-1">mdi-check</v-icon>
          {{ modelValue.cvFile.name }}
        </v-chip>
      </div>
      <input type="file" accept=".pdf,.doc,.docx" @change="onCvChange" />
      <p class="text-caption text-medium-emphasis mt-1">
        Le contenu du CV sera analysé pour pré-remplir les compétences et améliorer le matching.
      </p>
    </div>

    <!-- Compétences (auto-remplies depuis le CV, modifiables) -->
    <v-textarea
      :model-value="modelValue.competences"
      @update:model-value="emit('update:modelValue', { ...modelValue, competences: $event })"
      label="Compétences"
      variant="outlined"
      density="comfortable"
      rows="2"
      placeholder="Ex: PHP, Laravel, React, JavaScript... (auto-rempli depuis votre CV)"
      hint="Pré-rempli automatiquement depuis votre CV — modifiable"
      persistent-hint
      class="mb-3"
    />

    <!-- Secteur d'activité souhaité -->
    <v-autocomplete
      :model-value="modelValue.secteur_souhaite_id"
      @update:model-value="emit('update:modelValue', { ...modelValue, secteur_souhaite_id: $event })"
      :items="activitySectors"
      item-title="name"
      item-value="id"
      label="Secteur d'activité souhaité"
      variant="outlined"
      density="comfortable"
      prepend-inner-icon="mdi-briefcase-outline"
      clearable
      hint="Laissez vide = peu importe"
      persistent-hint
      class="mb-3"
    />

    <!-- Pays souhaités -->
    <v-combobox
      :model-value="modelValue.pays_souhaites"
      @update:model-value="emit('update:modelValue', { ...modelValue, pays_souhaites: $event })"
      label="Pays où je souhaite travailler"
      variant="outlined"
      density="comfortable"
      multiple
      chips
      closable-chips
      prepend-inner-icon="mdi-earth"
      hint="Laissez vide = flexible"
      persistent-hint
      class="mb-3"
      placeholder="Ex: France, Canada…"
    />

    <!-- Villes souhaitées -->
    <v-combobox
      :model-value="modelValue.villes_souhaitees"
      @update:model-value="emit('update:modelValue', { ...modelValue, villes_souhaitees: $event })"
      label="Villes souhaitées"
      variant="outlined"
      density="comfortable"
      multiple
      chips
      closable-chips
      prepend-inner-icon="mdi-city-variant-outline"
      hint="Laissez vide = flexible"
      persistent-hint
      class="mb-4"
      placeholder="Ex: Paris, Lyon…"
    />

    <!-- Actions -->
    <div class="d-flex gap-2">
      <v-btn
        color="primary"
        :loading="loading"
        :disabled="!modelValue.poste_recherche || parsingCv"
        @click="emit('submit')"
      >
        <v-icon size="16" class="mr-1">mdi-auto-fix</v-icon>
        Lancer le matching IA
      </v-btn>
      <v-btn v-if="$attrs.onCancel !== undefined" variant="text" @click="emit('cancel')">
        Annuler
      </v-btn>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue:    { type: Object, required: true },
  activitySectors: { type: Array, default: () => [] },
  parsingCv:     { type: Boolean, default: false },
  loading:       { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'cv-change', 'submit', 'cancel'])

const onCvChange = (e) => {
  const file = e.target.files?.[0] ?? null
  emit('update:modelValue', { ...props.modelValue, cvFile: file })
  emit('cv-change', file)
}
</script>
