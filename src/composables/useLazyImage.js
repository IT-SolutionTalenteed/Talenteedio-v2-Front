import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable pour le lazy loading d'images avec Intersection Observer
 * Améliore les performances en chargeant les images uniquement quand elles sont visibles
 */
export function useLazyImage() {
  const observer = ref(null)

  /**
   * Initialise l'Intersection Observer pour le lazy loading
   * @param {Function} callback - Fonction appelée quand un élément devient visible
   * @param {Object} options - Options de l'observer
   */
  const initObserver = (callback, options = {}) => {
    const defaultOptions = {
      root: null,
      rootMargin: '50px', // Commence à charger 50px avant que l'image soit visible
      threshold: 0.01
    }

    observer.value = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target)
          observer.value.unobserve(entry.target)
        }
      })
    }, { ...defaultOptions, ...options })

    return observer.value
  }

  /**
   * Observe un élément pour le lazy loading
   * @param {HTMLElement} element - Élément à observer
   */
  const observe = (element) => {
    if (observer.value && element) {
      observer.value.observe(element)
    }
  }

  /**
   * Arrête d'observer un élément
   * @param {HTMLElement} element - Élément à ne plus observer
   */
  const unobserve = (element) => {
    if (observer.value && element) {
      observer.value.unobserve(element)
    }
  }

  /**
   * Nettoie l'observer
   */
  const cleanup = () => {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = null
    }
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    initObserver,
    observe,
    unobserve,
    cleanup
  }
}

/**
 * Directive Vue pour le lazy loading d'images
 * Usage: v-lazy="imageUrl"
 */
export const vLazy = {
  mounted(el, binding) {
    const imageUrl = binding.value
    
    // Image placeholder pendant le chargement
    const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18"%3EChargement...%3C/text%3E%3C/svg%3E'
    
    // Définir le placeholder
    if (el.tagName === 'IMG') {
      el.src = placeholder
      el.dataset.src = imageUrl
    } else {
      el.style.backgroundImage = `url(${placeholder})`
      el.dataset.bg = imageUrl
    }

    // Créer l'observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target
          
          if (target.tagName === 'IMG') {
            // Pour les balises <img>
            const img = new Image()
            img.onload = () => {
              target.src = target.dataset.src
              target.classList.add('lazy-loaded')
            }
            img.onerror = () => {
              target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23ffebee" width="400" height="300"/%3E%3Ctext fill="%23c62828" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16"%3EErreur de chargement%3C/text%3E%3C/svg%3E'
            }
            img.src = target.dataset.src
          } else {
            // Pour les background-image
            const img = new Image()
            img.onload = () => {
              target.style.backgroundImage = `url(${target.dataset.bg})`
              target.classList.add('lazy-loaded')
            }
            img.src = target.dataset.bg
          }
          
          observer.unobserve(target)
        }
      })
    }, {
      root: null,
      rootMargin: '50px',
      threshold: 0.01
    })

    observer.observe(el)
    
    // Stocker l'observer pour le cleanup
    el._lazyObserver = observer
  },
  
  unmounted(el) {
    if (el._lazyObserver) {
      el._lazyObserver.disconnect()
      delete el._lazyObserver
    }
  }
}
