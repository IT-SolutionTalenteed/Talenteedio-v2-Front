<template>
  <footer class="site-footer">
    <div class="footer-bg"></div>
    <div class="footer-overlay"></div>
    <div class="footer-content">
      <div class="container">
        <div class="footer-row">
          <div class="footer-links">
            <router-link to="/legal/conditions-generales">{{ t('footer.terms') }}</router-link>
            <router-link to="/legal/confidentialite">{{ t('footer.privacy') }}</router-link>
          </div>
          <div class="footer-copyright">
            <p>© {{ currentYear }} {{ t('footer.copyright') }}</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const currentYear = new Date().getFullYear()
</script>


<style scoped>
.site-footer { 
  position: relative; 
  background: #040a5d; 
  color: rgba(255,255,255,.85); 
  overflow: hidden;
  margin-top: auto;
}
.footer-bg { 
  position: absolute; 
  inset: 0; 
  background: linear-gradient(135deg, #040a5d 0%, #192bc2 100%); 
  opacity: .95; 
}
.footer-overlay { 
  position: absolute; 
  inset: 0; 
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.03" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,133.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom; 
  background-size: cover; 
  opacity: 0.5;
}
.footer-content { 
  position: relative; 
  padding: 20px 0;
  border-top: 1px solid rgba(255,255,255,.1);
}
.footer-row { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  gap: 20px; 
}
.footer-links { 
  display: flex; 
  gap: 32px; 
  align-items: center; 
}
.footer-links a { 
  font-size: 14px; 
  color: rgba(255,255,255,.8); 
  text-decoration: none; 
  transition: color .2s; 
  font-weight: 500;
}
.footer-links a:hover { 
  color: var(--orange, #f07c00); 
}
.footer-copyright p { 
  font-size: 14px; 
  margin: 0; 
  opacity: .7; 
  font-weight: 400;
}

@media (max-width: 768px) {
  .footer-row { 
    flex-direction: column; 
    text-align: center; 
    gap: 16px; 
  }
  .footer-links { 
    flex-direction: column; 
    gap: 12px; 
  }
}
</style>
