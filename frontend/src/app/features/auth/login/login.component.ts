import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
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
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    loginForm: FormGroup;

    constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.http.post<any>('http://localhost:8000/api/login', this.loginForm.value).subscribe({
                next: (response) => {
                    console.log('Login successful', response);
                    // Store token (if applicable, though Sanctum cookie might be used)
                    // Assuming response contains user object with role
                    const user = response.user || response; // Adjust based on actual API response structure

                    if (user.role === 'admin' || user.role === 'nutriologo') {
                        this.router.navigate(['/admin/dashboard']);
                    } else {
                        // Redirect to user dashboard or home
                        this.router.navigate(['/']);
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
