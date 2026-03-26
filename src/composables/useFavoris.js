/**
 * Composable singleton — state partagé entre PublicNav, Annonces et AnnonceDetail.
 * Les refs étant déclarées au niveau module, toutes les instances voient le même état.
 */
import { ref } from 'vue'
import axios from 'axios'

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const favoris    = ref([])   // liste complète des offres favorites
const loaded     = ref(false)

function getToken() {
  return localStorage.getItem('token')
}

function isTalent() {
  return !!getToken() && localStorage.getItem('userRole') === 'talent'
}

async function loadFavoris() {
  if (!isTalent()) return
  try {
    const res = await axios.get(`${apiBase}/talent/favoris`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    favoris.value = res.data
    loaded.value  = true
  } catch {}
}

/**
 * Toggle favori — met à jour la liste locale immédiatement.
 * Retourne le nouvel état booléen (true = ajouté, false = retiré).
 */
async function toggleFavori(offre) {
  if (!isTalent()) { window.location.href = '/login'; return false }
  try {
    const res = await axios.post(
      `${apiBase}/talent/offres/${offre.id}/favori`,
      {},
      { headers: { Authorization: `Bearer ${getToken()}` } },
    )
    if (res.data.favori) {
      // Ajouter si pas déjà présent
      if (!favoris.value.find(o => o.id === offre.id)) {
        favoris.value = [...favoris.value, offre]
      }
    } else {
      favoris.value = favoris.value.filter(o => o.id !== offre.id)
    }
    return res.data.favori
  } catch {
    return false
  }
}

async function removeFavori(offreId) {
  try {
    await axios.post(
      `${apiBase}/talent/offres/${offreId}/favori`,
      {},
      { headers: { Authorization: `Bearer ${getToken()}` } },
    )
    favoris.value = favoris.value.filter(o => o.id !== offreId)
  } catch {}
}

function isFavoriId(offreId) {
  return favoris.value.some(o => o.id === offreId)
}

export function useFavoris() {
  return { favoris, loaded, loadFavoris, toggleFavori, removeFavori, isFavoriId, isTalent }
}
