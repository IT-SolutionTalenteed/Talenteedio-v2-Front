<template>
  <div class="static-page-container">
    <!-- On redirige directement vers la page HTML statique -->
  </div>
</template>

<script>
export default {
  name: 'StaticPage',
  props: {
    page: {
      type: String,
      required: true
    }
  },
  mounted() {
    // Rediriger directement vers la page HTML statique
    // Cela évite les problèmes d'iframe et de vh
    window.location.href = `/static/${this.page}.html`
  }
}
</script>

<style scoped>
.static-page-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
