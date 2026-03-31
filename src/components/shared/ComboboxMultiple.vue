<template>
  <v-autocomplete
    v-model="model"
    :label="label"
    :items="items"
    :item-title="itemTitle"
    :item-value="itemValue"
    multiple
    chips
    closable-chips
    variant="outlined"
    density="compact"
    hide-details="auto"
    clearable
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  label:      { type: String, default: '' },
  items:      { type: Array,  default: () => [] },
  itemTitle:  { type: String, default: 'name' },
  itemValue:  { type: String, default: 'id' },
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>
