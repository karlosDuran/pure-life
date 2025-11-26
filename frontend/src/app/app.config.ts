import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

// Importaciones para el nuevo sistema de estilos de PrimeNG
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),      // Para conectar con Laravel
    provideAnimationsAsync(), // Para animaciones fluidas

    // Configuración del tema Aura (Simplificada)
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'system',
          // Hemos quitado la configuración de 'cssLayer' para evitar conflictos si no usas Tailwind
        }
      }
    })
  ]
};