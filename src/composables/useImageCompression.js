import { ref } from 'vue'

/**
 * Composable pour compresser les images avant upload
 * Réduit la taille des fichiers et optimise les dimensions
 */
export function useImageCompression() {
  const isCompressing = ref(false)
  const compressionError = ref(null)

  /**
   * Compresse une image en la redimensionnant et en réduisant la qualité
   * @param {File} file - Fichier image à compresser
   * @param {Object} options - Options de compression
   * @param {number} options.maxWidth - Largeur maximale (défaut: 1920px)
   * @param {number} options.maxHeight - Hauteur maximale (défaut: 1080px)
   * @param {number} options.quality - Qualité JPEG/WebP (0-1, défaut: 0.8)
   * @param {string} options.outputFormat - Format de sortie ('image/jpeg', 'image/webp', 'auto')
   * @returns {Promise<File>} - Fichier compressé
   */
  const compressImage = async (file, options = {}) => {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      outputFormat = 'auto' // 'auto' garde le format original ou utilise WebP si supporté
    } = options

    isCompressing.value = true
    compressionError.value = null

    try {
      // Vérifier que c'est bien une image
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image')
      }

      // Charger l'image
      const img = await loadImage(file)
      
      // Calculer les nouvelles dimensions en gardant le ratio
      const { width, height } = calculateDimensions(img.width, img.height, maxWidth, maxHeight)

      // Créer un canvas pour redimensionner
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      // Déterminer le format de sortie
      let mimeType = file.type
      if (outputFormat === 'auto') {
        // Utiliser WebP si supporté, sinon JPEG pour les photos
        const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
        if (supportsWebP && file.type !== 'image/png') {
          mimeType = 'image/webp'
        } else if (file.type === 'image/png') {
          mimeType = 'image/png'
        } else {
          mimeType = 'image/jpeg'
        }
      } else {
        mimeType = outputFormat
      }

      // Convertir en Blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, mimeType, quality)
      })

      // Créer un nouveau fichier avec le nom approprié
      const extension = mimeType.split('/')[1]
      const originalName = file.name.replace(/\.[^/.]+$/, '')
      const compressedFile = new File([blob], `${originalName}.${extension}`, {
        type: mimeType,
        lastModified: Date.now()
      })

      // Log des statistiques de compression
      const originalSizeKB = (file.size / 1024).toFixed(2)
      const compressedSizeKB = (compressedFile.size / 1024).toFixed(2)
      const reduction = (((file.size - compressedFile.size) / file.size) * 100).toFixed(1)
      
      console.log(`📦 Compression: ${originalSizeKB}KB → ${compressedSizeKB}KB (${reduction}% de réduction)`)

      return compressedFile

    } catch (error) {
      compressionError.value = error.message
      console.error('Erreur de compression:', error)
      // En cas d'erreur, retourner le fichier original
      return file
    } finally {
      isCompressing.value = false
    }
  }

  /**
   * Charge une image depuis un fichier
   */
  const loadImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Calcule les nouvelles dimensions en gardant le ratio
   */
  const calculateDimensions = (width, height, maxWidth, maxHeight) => {
    let newWidth = width
    let newHeight = height

    // Redimensionner si nécessaire
    if (width > maxWidth) {
      newWidth = maxWidth
      newHeight = (height * maxWidth) / width
    }

    if (newHeight > maxHeight) {
      newHeight = maxHeight
      newWidth = (width * maxHeight) / height
    }

    return {
      width: Math.round(newWidth),
      height: Math.round(newHeight)
    }
  }

  /**
   * Valide la taille d'un fichier
   * @param {File} file - Fichier à valider
   * @param {number} maxSizeMB - Taille maximale en MB (défaut: 10MB)
   * @returns {boolean} - true si valide
   */
  const validateFileSize = (file, maxSizeMB = 10) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      compressionError.value = `Le fichier est trop volumineux (max: ${maxSizeMB}MB)`
      return false
    }
    return true
  }

  /**
   * Valide le type de fichier
   * @param {File} file - Fichier à valider
   * @param {string[]} allowedTypes - Types MIME autorisés
   * @returns {boolean} - true si valide
   */
  const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']) => {
    if (!allowedTypes.includes(file.type)) {
      compressionError.value = `Type de fichier non autorisé. Formats acceptés: ${allowedTypes.join(', ')}`
      return false
    }
    return true
  }

  return {
    compressImage,
    isCompressing,
    compressionError,
    validateFileSize,
    validateFileType
  }
}
