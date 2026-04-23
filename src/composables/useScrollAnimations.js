/**
 * Composable pour gérer les animations au scroll
 * Uniformise les animations pour tous les composants
 */
import { onMounted, onUnmounted } from 'vue'

export function useScrollAnimations() {
  let observer = null

  const initAnimations = () => {
    // Configuration de l'IntersectionObserver
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    })

    // Observer tous les éléments avec la classe animate-on-scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el)
    })
  }

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onMounted(() => {
    // Petit délai pour s'assurer que le DOM est prêt
    setTimeout(initAnimations, 100)
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    initAnimations,
    cleanup
  }
}
