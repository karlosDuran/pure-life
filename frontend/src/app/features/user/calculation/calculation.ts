import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-calculation',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        InputTextModule,
        ButtonModule,
        SelectModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './calculation.html',
    styleUrls: ['./calculation.css']
})
export class CalculationComponent implements OnInit {
    user: any = {};
    loading: boolean = false;

    genders: any[] = [
        { label: 'Masculino', value: 'male' },
        { label: 'Femenino', value: 'female' }
    ];

    activityLevels: any[] = [
        { label: 'Sedentario (Poco o nada de ejercicio)', value: '1.2' },
        { label: 'Ligero (Ejercicio ligero 1-3 días/semana)', value: '1.375' },
        { label: 'Moderado (Ejercicio moderado 3-5 días/semana)', value: '1.55' },
        { label: 'Activo (Ejercicio fuerte 6-7 días/semana)', value: '1.725' },
        { label: 'Muy Activo (Ejercicio muy fuerte + trabajo físico)', value: '1.9' }
    ];

    imc: number | null = null;
    imcStatus: string = '';
    calories: number | null = null;

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.authService.currentUser.subscribe(user => {
            if (user) {
                this.user = { ...user };
                this.calculateResults();
            }
        });
    }

    calculate() {
        if (!this.user.weight || !this.user.height || !this.user.age || !this.user.gender || !this.user.activity_level) {
            this.messageService.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Por favor completa todos los campos.' });
            return;
        }

        // IMC Calculation (Keep local for immediate feedback, or move to backend too?)
        // Keeping IMC local for now as it's simple display logic, but calories come from backend.
        const heightInMeters = this.user.height / 100;
        this.imc = this.user.weight / (heightInMeters * heightInMeters);

        if (this.imc < 18.5) this.imcStatus = 'Bajo peso';
        else if (this.imc < 24.9) this.imcStatus = 'Peso normal';
        else if (this.imc < 29.9) this.imcStatus = 'Sobrepeso';
        else this.imcStatus = 'Obesidad';

        // Save data to trigger backend calculation
        this.saveData();
    }

    calculateResults() {
        if (this.user.weight && this.user.height) {
            const heightInMeters = this.user.height / 100;
            this.imc = this.user.weight / (heightInMeters * heightInMeters);

            if (this.imc < 18.5) this.imcStatus = 'Bajo peso';
            else if (this.imc < 24.9) this.imcStatus = 'Peso normal';
            else if (this.imc < 29.9) this.imcStatus = 'Sobrepeso';
            else this.imcStatus = 'Obesidad';
        }
        if (this.user.target_calories) {
            this.calories = this.user.target_calories;
        }
    }

    saveData() {
        this.loading = true;
        // Use the new dedicated calculation endpoint
        this.http.post('http://localhost:8000/api/calculate', this.user).subscribe({
            next: (response: any) => {
                // Update local user data with response (includes target_calories and updated profile fields)
                this.user = { ...this.user, ...response.user };
                this.calories = response.target_calories;
                this.imc = response.imc;

                // Update auth service state
                this.authService.updateUser(this.user);

                this.messageService.add({ severity: 'success', summary: 'Cálculo Exitoso', detail: 'Datos calculados y guardados correctamente.' });
                this.loading = false;
            },
            error: (error) => {
                console.error('Error calculating data', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo realizar el cálculo.' });
                this.loading = false;
            }
        });
    }
}
