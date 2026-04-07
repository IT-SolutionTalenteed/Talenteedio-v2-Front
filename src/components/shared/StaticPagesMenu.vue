<template>
  <div class="static-pages-menu">
    <div class="menu-section" v-if="entreprisePages.length">
      <h4 class="menu-section-title">
        <i class="fa-solid fa-building"></i>
        Pour les Entreprises
      </h4>
      <a 
        v-for="page in entreprisePages" 
        :key="page.name"
        :href="page.path"
        class="menu-item"
      >
        <i class="fa-solid" :class="page.icon"></i>
        <div>
          <strong>{{ page.title }}</strong>
          <small>{{ page.description }}</small>
        </div>
      </a>
    </div>

    <div class="menu-section" v-if="talentPages.length">
      <h4 class="menu-section-title">
        <i class="fa-solid fa-user-tie"></i>
        Pour les Talents
      </h4>
      <a 
        v-for="page in talentPages" 
        :key="page.name"
        :href="page.path"
        class="menu-item"
      >
        <i class="fa-solid" :class="page.icon"></i>
        <div>
          <strong>{{ page.title }}</strong>
          <small>{{ page.description }}</small>
        </div>
      </a>
    </div>

    <div class="menu-section" v-if="infoPages.length">
      <h4 class="menu-section-title">
        <i class="fa-solid fa-info-circle"></i>
        Informations
      </h4>
      <a 
        v-for="page in infoPages" 
        :key="page.name"
        :href="page.path"
        class="menu-item"
      >
        <i class="fa-solid" :class="page.icon"></i>
        <div>
          <strong>{{ page.title }}</strong>
          <small>{{ page.description }}</small>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import { getEntreprisePages, getTalentPages, getInfoPages } from '@/config/staticPages'

export default {
  name: 'StaticPagesMenu',
  computed: {
    entreprisePages() {
      return getEntreprisePages().filter(p => p.inMenu)
    },
    talentPages() {
      return getTalentPages().filter(p => p.inMenu)
    },
    infoPages() {
      return getInfoPages().filter(p => p.inMenu)
    }
  }
}
</script>

<style scoped>
.static-pages-menu {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
  min-width: 300px;
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.menu-section-title i {
  font-size: 1rem;
  color: #FF6B35;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: #f5f5f5;
  transform: translateX(4px);
}

.menu-item i {
  font-size: 1.5rem;
  color: #FF6B35;
  min-width: 24px;
  text-align: center;
}

.menu-item strong {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.menu-item small {
  display: block;
  font-size: 0.8rem;
  color: #666;
  line-height: 1.3;
}
</style>
