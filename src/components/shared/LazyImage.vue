<template>
  <img
    v-lazy="src"
    :alt="alt"
    :class="imgClass"
    :style="imgStyle"
    @error="onError"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  imgClass: {
    type: String,
    default: ''
  },
  imgStyle: {
    type: [String, Object],
    default: ''
  }
})

const emit = defineEmits(['error'])

const onError = (event) => {
  emit('error', event)
}
</script>
