import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-roles',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        DialogModule,
        TagModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './roles.html',
    styleUrls: ['./roles.css']
})
export class RolesComponent implements OnInit {
    roles: any[] = [];
    allUsers: any[] = [];
    selectedRoleUsers: any[] = [];
    selectedRoleName: string = '';
    userDialog: boolean = false;
    loading: boolean = true;

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading = true;
        this.http.get<any[]>('http://localhost:8000/api/users').subscribe({
            next: (users) => {
                this.allUsers = users;
                this.calculateRoles();
                this.loading = false;
            },
            error: (error) => {
                console.error('Error fetching users', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos' });
                this.loading = false;
            }
        });
    }

    calculateRoles() {
        const nutriologos = this.allUsers.filter(u => u.role === 'nutriologo');
        const usuarios = this.allUsers.filter(u => u.role === 'usuario');

        this.roles = [
            { name: 'Nutriólogo', code: 'nutriologo', count: nutriologos.length, users: nutriologos },
            { name: 'Usuario', code: 'usuario', count: usuarios.length, users: usuarios }
        ];
    }

    showUsers(role: any) {
        this.selectedRoleName = role.name;
        this.selectedRoleUsers = role.users;
        this.userDialog = true;
    }

    getSeverity(role: string) {
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
