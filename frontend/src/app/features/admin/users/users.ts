import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ToolbarModule,
    PasswordModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading: boolean = true;
  roles: any[] = [
    { label: 'Nutriólogo', value: 'nutriologo' },
    { label: 'Usuario', value: 'usuario' }
  ];

  userDialog: boolean = false;
  user: any = {};
  submitted: boolean = false;

  @ViewChild('dt2') dt2: Table | undefined;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:8000/api/users').subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching users', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios' });
        this.loading = false;
      }
    });
  }

  openNew() {
    this.user = {};
    this.submitted = false;
    this.userDialog = true;
  }

  editUser(user: any) {
    this.user = { ...user };
    this.userDialog = true;
  }

  deleteUser(user: any) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar a ' + user.name + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.delete('http://localhost:8000/api/users/' + user.id).subscribe({
          next: () => {
            this.users = this.users.filter((val) => val.id !== user.id);
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Usuario eliminado', life: 3000 });
          },
          error: (error) => {
            console.error('Error deleting user', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el usuario' });
          }
        });
      }
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;

    if (this.user.name?.trim() && this.user.email?.trim() && this.user.role) {
      if (this.user.id) {
        // Update
        this.http.put('http://localhost:8000/api/users/' + this.user.id, this.user).subscribe({
          next: (response: any) => {
            const index = this.users.findIndex((u) => u.id === this.user.id);
            this.users[index] = response;
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Usuario actualizado', life: 3000 });
            this.users = [...this.users];
            this.userDialog = false;
            this.user = {};
          },
          error: (error) => {
            console.error('Error updating user', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el usuario' });
          }
        });
      } else {
        // Create
        // Password is required for new users
        if (!this.user.password) {
          return;
        }

        // Ensure password confirmation matches (simplified for this example, or just send same password)
        this.user.password_confirmation = this.user.password;

        this.http.post('http://localhost:8000/api/users', this.user).subscribe({
          next: (response: any) => {
            this.users.push(response);
            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Usuario creado', life: 3000 });
            this.users = [...this.users];
            this.userDialog = false;
            this.user = {};
          },
          error: (error) => {
            console.error('Error creating user', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el usuario' });
          }
        });
      }
    }
  }

  getSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (role) {
      case 'nutriologo':
        return 'success';
      case 'usuario':
        return 'info';
      default:
        return 'secondary';
    }
  }
}
