<template>
  <div class="deferred-cover">
    <div
      class="deferred-cover__layer"
      :class="{ 'deferred-cover__layer--visible': visible }"
      :style="{ backgroundImage: `url('${imageUrl}')` }"
    />
    <img
      :key="imageUrl"
      :src="imageUrl"
      alt=""
      class="deferred-cover__probe"
      @load="visible = true"
      @error="visible = true"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  imageUrl: { type: String, required: true },
})

const visible = ref(false)

watch(
  () => props.imageUrl,
  () => {
    visible.value = false
  },
)
</script>

<style scoped>
.deferred-cover {
  position: absolute;
  inset: 0;
}
.deferred-cover__layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.3s ease-out;
}
.deferred-cover__layer--visible {
  opacity: 1;
}
.deferred-cover__probe {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
  border: 0;
}
</style>
