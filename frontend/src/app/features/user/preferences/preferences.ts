import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-preferences',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        InputTextModule,
        ButtonModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './preferences.html',
    styleUrls: ['./preferences.css']
})
export class PreferencesComponent implements OnInit {
    user: any = {};
    excludedFoods: string[] = [];
    excludedFoodsString: string = '';
    loading: boolean = false;

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.authService.currentUser.subscribe(user => {
            if (user) {
                this.user = { ...user };
                // Parse excluded_foods if it's a string (JSON) or use as is if array
                if (typeof this.user.excluded_foods === 'string') {
                    try {
                        this.excludedFoods = JSON.parse(this.user.excluded_foods) || [];
                    } catch (e) {
                        this.excludedFoods = [];
                    }
                } else {
                    this.excludedFoods = this.user.excluded_foods || [];
                }
                this.excludedFoodsString = this.excludedFoods.join(', ');
            }
        });
    }

    savePreferences() {
        this.loading = true;
        // Split string by comma and trim whitespace
        this.excludedFoods = this.excludedFoodsString.split(',').map(item => item.trim()).filter(item => item !== '');
        this.user.excluded_foods = this.excludedFoods;

        this.http.put('http://localhost:8000/api/users/' + this.user.id, this.user).subscribe({
            next: (response: any) => {
                this.user = { ...this.user, ...response };
                this.authService.updateUser(this.user);
                this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Preferencias guardadas' });
                this.loading = false;
            },
            error: (error) => {
                console.error('Error saving preferences', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron guardar las preferencias' });
                this.loading = false;
            }
        });
    }
}
