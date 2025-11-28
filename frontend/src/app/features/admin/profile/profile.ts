import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        FileUploadModule,
        ToastModule,
        AvatarModule
    ],
    providers: [MessageService],
    templateUrl: './profile.html',
    styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
    user: any = {};
    loading: boolean = false;

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            this.user = JSON.parse(storedUser);
            // Fetch fresh data from API to be sure
            this.http.get('http://localhost:8000/api/users/' + this.user.id).subscribe({
                next: (data) => {
                    this.user = { ...this.user, ...data };
                },
                error: (error) => {
                    console.error('Error fetching profile', error);
                }
            });
        }
    }

    onFileSelect(event: any) {
        if (event.files && event.files.length > 0) {
            this.user.image = event.files[0];

            // Create preview
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.user.previewUrl = e.target.result;
            };
            reader.readAsDataURL(this.user.image);
        }
    }

    saveProfile() {
        this.loading = true;
        const formData = new FormData();
        formData.append('name', this.user.name);
        formData.append('email', this.user.email);
        formData.append('role', this.user.role);
        formData.append('_method', 'PUT'); // Laravel requires this for PUT requests with FormData

        if (this.user.password) {
            formData.append('password', this.user.password);
            formData.append('password_confirmation', this.user.password);
        }

        if (this.user.image) {
            formData.append('image', this.user.image);
        }

        this.http.post('http://localhost:8000/api/users/' + this.user.id, formData).subscribe({
            next: (response: any) => {
                this.user = { ...this.user, ...response };
                this.authService.updateUser(this.user);
                this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Perfil actualizado', life: 3000 });
                this.loading = false;
                this.user.password = '';
                if (this.user.profile_photo_path) {
                    this.user.profile_photo_url = 'http://localhost:8000/storage/' + this.user.profile_photo_path;
                }
            },
            error: (error) => {
                console.error('Error updating profile', error);
                let errorMessage = 'No se pudo actualizar el perfil';
                if (error.error && error.error.message) {
                    errorMessage += ': ' + error.error.message;
                }
                if (error.error && error.error.errors) {
                    const validationErrors = Object.values(error.error.errors).flat().join(', ');
                    errorMessage += ': ' + validationErrors;
                }
                this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
                this.loading = false;
            }
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
