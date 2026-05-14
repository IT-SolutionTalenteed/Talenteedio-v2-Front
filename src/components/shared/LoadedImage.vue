<template>
  <img
    ref="imgRef"
    :src="src"
    :alt="alt"
    :loading="loading"
    :class="['loaded-img', imgClass, { 'loaded-img--ready': isReady }]"
    :style="imgStyle"
    decoding="async"
    @load="markReady"
    @error="markReady"
  />
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  loading: { type: String, default: 'lazy' },
  imgClass: { type: [String, Object, Array], default: '' },
  imgStyle: { type: [String, Object], default: undefined },
})

const isReady = ref(false)
const imgRef = ref(null)

function markReady() {
  isReady.value = true
}

function checkCached() {
  nextTick(() => {
    const el = imgRef.value
    if (el?.complete && el.naturalWidth > 0) {
      markReady()
    }
  })
}

watch(
  () => props.src,
  () => {
    isReady.value = false
    checkCached()
  },
  { immediate: true },
)

onMounted(() => checkCached())
</script>

<style scoped>
.loaded-img {
  opacity: 0;
  transition: opacity 0.28s ease-out;
}
.loaded-img--ready {
  opacity: 1;
}
</style>
