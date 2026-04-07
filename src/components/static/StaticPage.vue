<template>
  <div class="static-page-wrapper">
    <iframe 
      :src="iframeSrc" 
      frameborder="0"
      class="static-iframe"
      @load="onIframeLoad"
    ></iframe>
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
  computed: {
    iframeSrc() {
      return `/static/${this.page}.html`
    }
  },
  methods: {
    onIframeLoad() {
      // Ajuster la hauteur de l'iframe si nécessaire
      const iframe = this.$el.querySelector('iframe')
      if (iframe && iframe.contentWindow) {
        try {
          const height = iframe.contentWindow.document.body.scrollHeight
          iframe.style.height = height + 'px'
        } catch (e) {
          // Ignore cross-origin errors
        }
      }
    }
  }
}
</script>

<style scoped>
.static-page-wrapper {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.static-iframe {
  width: 100%;
  min-height: 100vh;
  border: none;
  display: block;
}
</style>
