import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

// Importaciones para el nuevo sistema de estilos de PrimeNG
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),      // Para conectar con Laravel
    provideAnimationsAsync(), // Para animaciones fluidas

    // Configuración del tema Aura (Simplificada)
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'none', // Forzamos modo claro para evitar problemas de contraste
          // Hemos quitado la configuración de 'cssLayer' para evitar conflictos si no usas Tailwind
        }
      }
    })
  ]
};