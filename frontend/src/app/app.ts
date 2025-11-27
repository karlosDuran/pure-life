import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html'
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