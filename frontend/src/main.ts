import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Import global styles
import './style.css';

// Create Vue app instance
const app = createApp(App);

// Create and use Pinia FIRST (before router)
const pinia = createPinia();
app.use(pinia);

// Use Vue Router
app.use(router);

// Mount the app
app.mount('#app');