/**
 * Extrait un message d'erreur lisible depuis une réponse Axios / Laravel.
 * Gère les erreurs de validation (422), les messages simples, et les erreurs réseau.
 */
export function parseApiError(err, fallback = "Une erreur est survenue.") {
  if (!err.response) {
    return "Impossible de contacter le serveur. Vérifiez votre connexion."
  }

  const data = err.response.data

  // Erreurs de validation Laravel (422)
  if (data?.errors && typeof data.errors === 'object') {
    const messages = Object.values(data.errors).flat()
    return messages.join('\n')
  }

  // Message simple
  if (data?.message && typeof data.message === 'string') {
    return data.message
  }

  return fallback
}
