// Configuration des rôles utilisateur
// Ce fichier définit les rôles disponibles et leurs permissions

export const ROLES = {
  ADMIN: 'admin',
  COMPANY: 'company',
  ENTREPRISE: 'entreprise', // Alias pour company
  TALENT: 'talent',
  CONSULTANT: 'consultant',
  REFERRAL: 'referral',
  HR_FIRST_CLUB: 'hr-first-club'
};

// Fonction utilitaire pour vérifier le rôle
export const hasRole = (role) => {
  const userRole = localStorage.getItem('userRole');
  return userRole === role;
};

// Fonction utilitaire pour obtenir le rôle actuel
export const getCurrentRole = () => {
  return localStorage.getItem('userRole') || ROLES.ADMIN;
};

// Fonction utilitaire pour définir le rôle
export const setRole = (role) => {
  if (Object.values(ROLES).includes(role)) {
    localStorage.setItem('userRole', role);
    return true;
  }
  console.error(`Rôle invalide: ${role}`);
  return false;
};

// Fonction utilitaire pour supprimer le rôle (déconnexion)
export const clearRole = () => {
  localStorage.removeItem('userRole');
};

export default {
  ROLES,
  hasRole,
  getCurrentRole,
  setRole,
  clearRole
};
