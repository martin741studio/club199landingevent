import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: [
        resolve(__dirname, 'components'),
        resolve(__dirname, 'components/buttons'),
        resolve(__dirname, 'components/cards'),
        resolve(__dirname, 'components/forms'),
        resolve(__dirname, 'components/layout'),
        resolve(__dirname, 'components/navigation'),
        resolve(__dirname, 'components/room-modal'),
        resolve(__dirname, 'sections'),
        resolve(__dirname, 'sections/hero'),
        resolve(__dirname, 'sections/intro'),
        resolve(__dirname, 'sections/location'),
        resolve(__dirname, 'sections/spaces'),
        resolve(__dirname, 'sections/experiences'),
        resolve(__dirname, 'sections/catering'),
        resolve(__dirname, 'sections/event-types'),
        resolve(__dirname, 'sections/membership'),
        resolve(__dirname, 'sections/faq'),
        resolve(__dirname, 'sections/trust'),
        resolve(__dirname, 'sections/cta'),
        resolve(__dirname, 'sections/footer'),
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
});
