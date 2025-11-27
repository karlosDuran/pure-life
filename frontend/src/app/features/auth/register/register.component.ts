import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        SelectModule,
        HttpClientModule,
        RouterModule,
        FloatLabelModule
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm: FormGroup;
    roles = [
        { label: 'Paciente', value: 'usuario' },
        { label: 'Nutriólogo', value: 'nutriologo' }
    ];

    constructor(private fb: FormBuilder, private http: HttpClient) {
        this.registerForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            password_confirmation: ['', Validators.required],
            role: ['usuario', Validators.required]
        });
    }

    onSubmit() {
        if (this.registerForm.valid) {
            const formData = { ...this.registerForm.value };
            formData.email = formData.email.toLowerCase();

            this.http.post('http://localhost:8000/api/register', formData).subscribe({
                next: (response) => {
                    console.log('Registration successful', response);
                    alert('Registro exitoso! Ahora puedes iniciar sesión.');
                    // Optional: Redirect to login
                },
                error: (error) => {
                    console.error('Registration failed', error);
                    alert('Error en el registro: ' + (error.error.message || error.message || 'Error desconocido'));
                }
            });
        }
    }
}
