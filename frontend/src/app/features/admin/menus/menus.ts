import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
    selector: 'app-menus',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        ToastModule,
        ToolbarModule,
        ConfirmDialogModule,
        SelectModule,
        TagModule,
        IconFieldModule,
        InputIconModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './menus.html',
    styleUrls: ['./menus.css']
})
export class MenusComponent implements OnInit {
    menus: any[] = [];
    menu: any = {};
    submitted: boolean = false;
    menuDialog: boolean = false;
    loading: boolean = true;
    types: any[] = [
        { label: 'Vegetariana', value: 'vegetariana' },
        { label: 'Omnívora', value: 'omnivora' }
    ];

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.getMenus();
    }

    getMenus() {
        this.loading = true;
        this.http.get<any[]>('http://localhost:8000/api/menus').subscribe({
            next: (data) => {
                this.menus = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error fetching menus', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los menús' });
                this.loading = false;
            }
        });
    }

    openNew() {
        this.menu = {};
        this.submitted = false;
        this.menuDialog = true;
    }

    editMenu(menu: any) {
        this.menu = { ...menu };
        this.menuDialog = true;
    }

    deleteMenu(menu: any) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de que quieres eliminar ' + menu.name + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.http.delete('http://localhost:8000/api/menus/' + menu.id).subscribe({
                    next: () => {
                        this.menus = this.menus.filter((val) => val.id !== menu.id);
                        this.menu = {};
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Menú Eliminado', life: 3000 });
                    },
                    error: (error) => {
                        console.error('Error deleting menu', error);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el menú' });
                    }
                });
            }
        });
    }

    hideDialog() {
        this.menuDialog = false;
        this.submitted = false;
    }

    saveMenu() {
        this.submitted = true;

        if (this.menu.name && this.menu.type && this.menu.calories) {
            if (this.menu.id) {
                this.http.put('http://localhost:8000/api/menus/' + this.menu.id, this.menu).subscribe({
                    next: (response: any) => {
                        const index = this.menus.findIndex((m) => m.id === this.menu.id);
                        this.menus[index] = response;
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Menú Actualizado', life: 3000 });
                        this.menus = [...this.menus];
                        this.menuDialog = false;
                        this.menu = {};
                    },
                    error: (error) => {
                        console.error('Error updating menu', error);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el menú' });
                    }
                });
            } else {
                this.http.post('http://localhost:8000/api/menus', this.menu).subscribe({
                    next: (response: any) => {
                        this.menus.push(response);
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Menú Creado', life: 3000 });
                        this.menus = [...this.menus];
                        this.menuDialog = false;
                        this.menu = {};
                    },
                    error: (error) => {
                        console.error('Error creating menu', error);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el menú' });
                    }
                });
            }
        }
    }

    getSeverity(type: string) {
        switch (type) {
            case 'vegetariana':
                return 'success';
            case 'omnivora':
                return 'warn';
            default:
                return 'info';
        }
    }
}
