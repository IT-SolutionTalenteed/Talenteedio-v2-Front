<template>
  <!-- Sidebar -->
  <aside class="navbar navbar-vertical navbar-expand-lg" data-bs-theme="dark">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#sidebar-menu"
        aria-controls="sidebar-menu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-header d-flex justify-content-between px-3">
        <h1 class="navbar-brand navbar-brand-autodark">
          <router-link to="/">
            <img
              src="/logo.png"
              width="110"
              height="50"
              alt="Talenteed"
              class="navbar-brand-image"
            />
          </router-link>
        </h1>
        <div class="navbar-nav flex-row">
          <div class="nav-item dropdown">
            <a
              href="#"
              class="nav-link d-flex lh-1 text-reset p-0"
              data-bs-toggle="dropdown"
              aria-label="Open user menu"
            >
              <i class="bi bi-person-fill"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <a href="#" class="dropdown-item" @click.prevent="handleLogout">Déconnexion</a>
            </div>
          </div>
        </div>
      </div>

      <div class="collapse navbar-collapse" id="sidebar-menu">
        <ul class="navbar-nav pt-lg-3">
          <li v-for="nav in sideNav" :key="nav.label" class="nav-item">
            <router-link 
              class="nav-link" 
              v-if="nav.route && !nav.children?.length" 
              :to="nav.route"
            >
              <i :class="nav.icon"></i>
              <span class="nav-link-title"> {{ nav.label }} </span>
            </router-link>
            <a
              class="nav-link dropdown-toggle"
              href="#"
              data-bs-toggle="dropdown"
              data-bs-auto-close="false"
              role="button"
              aria-expanded="false"
              v-if="nav.children?.length"
              @click.prevent
            >
              <i :class="nav.icon"></i>
              <span class="nav-link-title"> {{ nav.label }} </span>
            </a>
            <div v-if="nav.children?.length" class="dropdown-menu">
              <router-link
                v-for="children in nav.children"
                :key="children.label"
                class="dropdown-item"
                :to="children.route"
              >
                <span class="nav-link-title"> {{ children.label }} </span>
              </router-link>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDashboardStore } from '@/stores/dashboard.store';

const router = useRouter();
const dashboardStore = useDashboardStore();

// TODO: Remplacer par votre logique d'authentification réelle
const userRole = computed(() => {
  // Récupérer le rôle depuis le localStorage ou un store
  return localStorage.getItem('userRole') || 'admin';
});

const handleTabClick = (tab) => {
  console.log('Tab clicked:', tab);
  dashboardStore.setActiveTab(tab);
  console.log('Active tab after click:', dashboardStore.activeTab);
};

const handleLogout = () => {
  // TODO: Implémenter la logique de déconnexion
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  router.push({ name: 'Login' });
};

const sideNav = computed(() => {
  const role = userRole.value;

  if (role === 'admin') {
    return [
      {
        label: 'Vue d\'ensemble',
        route: { name: 'AdminOverview' },
        icon: 'bi bi-speedometer2'
      },
      {
        label: 'Événements',
        icon: 'bi bi-calendar-event',
        children: [
          { label: 'Catégories événement', route: { name: 'AdminCategorieEvenements' } },
          { label: 'Événements', route: { name: 'AdminEvenements' } }
        ]
      },
      {
        label: 'Offres',
        route: { name: 'AdminOffres' },
        icon: 'bi bi-bag'
      },
      {
        label: 'Contenu',
        icon: 'bi bi-newspaper',
        children: [
          { label: 'Catégories Média', route: { name: 'AdminMediaCategories' } },
          { label: 'Articles', route: { name: 'AdminArticles' } }
        ]
      },
      {
        label: 'Entreprises & Talents',
        icon: 'bi bi-people',
        children: [
          { label: 'Entreprises', route: { name: 'AdminEntreprises' } },
          { label: 'Talents', route: { name: 'AdminTalents' } },
          { label: 'Entretiens par stand', route: { name: 'AdminEntretiens' } },
          { label: 'Feedbacks', route: { name: 'AdminFeedbacks' } },
          { label: 'Import XLS', route: { name: 'AdminImportCandidats' } },
          { label: 'Sync CRM HubSpot', route: { name: 'AdminSyncCrm' } }
        ]
      },
      {
        label: 'Référentiels',
        icon: 'bi bi-gear',
        children: [
          { label: 'Contrats de travail', route: { name: 'AdminJobContracts' } },
          { label: 'Modes de travail', route: { name: 'AdminJobModes' } },
          { label: 'Compétences', route: { name: 'AdminSkills' } },
          { label: 'Niveaux d\'étude', route: { name: 'AdminStudyLevels' } },
          { label: 'Expériences', route: { name: 'AdminExperiences' } },
          { label: 'Langues', route: { name: 'AdminLanguages' } },
          { label: 'Secteurs d\'activité', route: { name: 'AdminActivitySectors' } },
          { label: 'CGU / Mentions légales', route: { name: 'AdminLegalPages' } }
        ]
      }
    ];
  } else if (role === 'company' || role === 'entreprise') {
    return [
      {
        label: 'Dashboard',
        route: { name: 'EntrepriseDashboard' },
        icon: 'bi bi-speedometer2'
      },
      {
        label: 'Mes offres',
        route: { name: 'EntrepriseDashboard' },
        icon: 'bi bi-bag'
      },
      {
        label: 'Candidatures',
        route: { name: 'EntrepriseDashboard' },
        icon: 'bi bi-people'
      },
      {
        label: 'Événements',
        route: { name: 'EntrepriseDashboard' },
        icon: 'bi bi-calendar-event'
      },
      {
        label: 'Articles',
        route: { name: 'EntrepriseDashboard' },
        icon: 'bi bi-newspaper'
      },
      {
        label: 'Entretiens',
        route: { name: 'EntrepriseDashboard' },
        icon: 'bi bi-calendar-check'
      }
    ];
  } else if (role === 'talent') {
    return [
      {
        label: 'Dashboard',
        route: { name: 'TalentDashboard' },
        icon: 'bi bi-speedometer2'
      },
      {
        label: 'Offres d\'emploi',
        route: { name: 'TalentDashboard' },
        icon: 'bi bi-bag'
      },
      {
        label: 'Mes candidatures',
        route: { name: 'TalentDashboard' },
        icon: 'bi bi-bag-check'
      },
      {
        label: 'Mes favoris',
        route: { name: 'TalentDashboard' },
        icon: 'bi bi-heart'
      },
      {
        label: 'Événements',
        route: { name: 'TalentDashboard' },
        icon: 'bi bi-calendar-event'
      },
      {
        label: 'Mes entretiens',
        route: { name: 'TalentDashboard' },
        icon: 'bi bi-calendar-check'
      },
      {
        label: 'Mes feedbacks',
        route: { name: 'TalentDashboard' },
        icon: 'bi bi-chat-dots'
      }
    ];
  }

  return [];
});
</script>

<style scoped lang="scss">
.navbar-header {
  flex-grow: 1;
}

.nav-link {
  .bi {
    font-size: 20px;
  }

  .nav-link-title {
    margin-left: 10px;
  }
}

@media (min-width: 992px) {
  .navbar-header {
    flex-grow: 0;

    .navbar-brand-image {
      filter: none;
      height: unset;
    }
  }

  .navbar-vertical.navbar-expand-lg .navbar-nav {
    flex-direction: column;
    flex-grow: 0;
    min-height: auto;
  }
}
</style>
