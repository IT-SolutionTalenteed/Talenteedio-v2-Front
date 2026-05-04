<template>
  <div class="notfound-page">
    <div class="notfound-card">
      <div class="notfound-code">404</div>
      <div class="notfound-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#192bc2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="11" y1="8" x2="11" y2="11"/><line x1="11" y1="14" x2="11.01" y2="14"/>
        </svg>
      </div>
      <h1 class="notfound-title">Page introuvable</h1>
      <p class="notfound-text">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div class="notfound-actions">
        <router-link to="/home" class="btn-primary">
          Retour à l'accueil
        </router-link>
        <button class="btn-secondary" @click="$router.back()">
          Page précédente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.notfound-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4f8;
  padding: 24px 16px;
}
.notfound-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 32px rgba(4,10,93,0.10);
  padding: 64px 48px;
  text-align: center;
  max-width: 480px;
  width: 100%;
}
.notfound-code {
  font-size: 96px;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, #040a5d 0%, #192bc2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}
.notfound-icon {
  width: 80px;
  height: 80px;
  background: rgba(25,43,194,0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}
.notfound-title {
  font-size: 24px;
  font-weight: 700;
  color: #040a5d;
  margin-bottom: 12px;
}
.notfound-text {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 32px;
}
.notfound-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.btn-primary {
  background: linear-gradient(135deg, #040a5d 0%, #192bc2 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: opacity 0.2s;
}
.btn-primary:hover { opacity: 0.9; }
.btn-secondary {
  background: transparent;
  color: #192bc2;
  border: 1.5px solid #192bc2;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-secondary:hover { background: rgba(25,43,194,0.06); }
</style>
