<template>
  <Aside />

  <div class="page-wrapper" :key="route.fullPath">
    <div class="page-content container-xl d-flex flex-column flex-grow-1">
      <Suspense>
        <RouterView />

        <template #fallback>
          <Loader />
        </template>
      </Suspense>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

import Aside from './Aside.vue';
import Footer from './Footer.vue';
import Loader from './Loader.vue';

const route = useRoute();
</script>

<style lang="scss">
.page-wrapper {
  height: 100%;
  overflow: hidden;
}

.page-content {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  .page-body {
    overflow: visible;
    flex: 1;
    display: flex;
    flex-direction: column;

    .card.flex-grow-1 {
      overflow: hidden auto;
    }

    .row.flex-grow-1 {
      overflow: hidden;

      .col-md-8,
      .col-md-4 {
        overflow: auto;
        height: 100%;
      }
    }
  }
}

@media (min-width: 992px) {
  .navbar-expand-lg.navbar-vertical ~ .navbar,
  .navbar-expand-lg.navbar-vertical ~ .page-wrapper {
    margin-left: 18rem;
  }
  .navbar-vertical.navbar-expand-lg {
    width: 18rem;
  }
}
</style>
