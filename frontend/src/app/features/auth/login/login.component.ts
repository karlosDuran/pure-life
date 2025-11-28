import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        HttpClientModule,
        RouterModule,
        FloatLabelModule,
        FormsModule,
        CheckboxModule
    ],
    providers: [MessageService], // Added for MessageService
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    loginForm: FormGroup;
    loading: boolean = false; // Added loading property

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private router: Router,
        private messageService: MessageService, // Injected MessageService
        private authService: AuthService // Injected AuthService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.loading = true; // Set loading to true
            this.http.post('http://localhost:8000/api/login', this.loginForm.value).subscribe({
                next: (response: any) => { // Changed type to any
                    this.authService.updateUser(response.user, response.access_token); // Use AuthService to update user and token
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login Successful' }); // Show success message
                    this.loading = false; // Set loading to false

                    // Redirect based on role
                    if (response.user.role === 'admin' || response.user.role === 'nutriologo') {
                        this.router.navigate(['/admin/dashboard']);
                    } else {
                        this.router.navigate(['/user/calculation']);
                    }
                },
                error: (error) => {
                    console.error('Login failed', error);
                    // Handle error (show message)
                }
            });
        }
    }
}
