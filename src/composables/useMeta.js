/**
 * Composable pour gérer les meta tags dynamiques
 * Utilisé pour le SEO et le partage sur les réseaux sociaux
 */

export function useMeta() {
  const setMeta = (metaData) => {
    // Title
    if (metaData.title) {
      document.title = `${metaData.title} | Talenteedio`
    }

    // Description
    updateMetaTag('name', 'description', metaData.description)
    updateMetaTag('property', 'og:description', metaData.description)
    updateMetaTag('property', 'twitter:description', metaData.description)

    // Title pour Open Graph et Twitter
    updateMetaTag('property', 'og:title', metaData.title || 'Talenteedio')
    updateMetaTag('property', 'twitter:title', metaData.title || 'Talenteedio')

    // Image
    if (metaData.image) {
      updateMetaTag('property', 'og:image', metaData.image)
      updateMetaTag('property', 'twitter:image', metaData.image)
    }

    // URL
    if (metaData.url) {
      updateMetaTag('property', 'og:url', metaData.url)
      updateMetaTag('property', 'twitter:url', metaData.url)
    }

    // Type
    updateMetaTag('property', 'og:type', metaData.type || 'website')

    // Site name
    updateMetaTag('property', 'og:site_name', 'Talenteedio')
  }

  const updateMetaTag = (attribute, key, content) => {
    if (!content) return

    let element = document.querySelector(`meta[${attribute}="${key}"]`)
    
    if (element) {
      element.setAttribute('content', content)
    } else {
      element = document.createElement('meta')
      element.setAttribute(attribute, key)
      element.setAttribute('content', content)
      document.head.appendChild(element)
    }
  }

  const resetMeta = () => {
    document.title = 'Talenteedio'
    updateMetaTag('name', 'description', 'Talenteedio est la première plateforme stratégique européenne dédiée à la mobilisation de l\'intelligence collective et des compétences rares de la diaspora.')
    updateMetaTag('property', 'og:title', 'Talenteedio')
    updateMetaTag('property', 'og:description', 'Talenteedio est la première plateforme stratégique européenne dédiée à la mobilisation de l\'intelligence collective et des compétences rares de la diaspora.')
    updateMetaTag('property', 'og:image', 'https://talenteed.io/favicon.png')
    updateMetaTag('property', 'og:url', window.location.href)
    updateMetaTag('property', 'twitter:title', 'Talenteedio')
    updateMetaTag('property', 'twitter:description', 'Talenteedio est la première plateforme stratégique européenne dédiée à la mobilisation de l\'intelligence collective et des compétences rares de la diaspora.')
  }

  return {
    setMeta,
    resetMeta
  }
}
