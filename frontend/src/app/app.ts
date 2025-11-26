import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  template: `
    <div style="padding: 50px; display: flex; justify-content: center;">
      <p-card header="Prueba de Conexión" [style]="{ width: '400px' }">
        
        <p>Estado del Backend:</p>
        
        <!-- Si hay datos, mostramos el mensaje de Laravel -->
        <div *ngIf="datosBackend; else cargando">
          <h2 style="color: green">{{ datosBackend.mensaje }}</h2>
          <p>{{ datosBackend.servidor }}</p>
        </div>

        <!-- Si no hay datos todavía -->
        <ng-template #cargando>
          <p style="color: gray">Esperando respuesta del servidor...</p>
        </ng-template>

        <ng-template pTemplate="footer">
          <p-button label="Refrescar" icon="pi pi-refresh" (onClick)="obtenerDatos()"></p-button>
        </ng-template>
      </p-card>
    </div>
  `
})
// IMPORTANTE: Aquí cambiamos el nombre de 'AppComponent' a 'App' para que coincida con main.ts
export class App implements OnInit {
  datosBackend: any = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.obtenerDatos();
  }

  obtenerDatos() {
    this.datosBackend = null;
    // Asegúrate que esta URL coincida con tu Laravel (puerto 8000)
    this.http.get('http://127.0.0.1:8000/api/prueba').subscribe({
      next: (resultado) => {
        this.datosBackend = resultado;
        console.log('Datos recibidos:', resultado);
      },
      error: (error) => {
        console.error('Error de conexión:', error);
        // Evitamos el alert para no ser molestos, solo log en consola
      }
    });
  }
}