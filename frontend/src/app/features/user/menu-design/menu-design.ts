import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService, SharedModule } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-menu-design',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        ButtonModule,
        TagModule,
        DataViewModule,
        DialogModule,
        TableModule,
        SelectModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        ToastModule,
        TooltipModule,
        SharedModule
    ],
    providers: [MessageService],
    templateUrl: './menu-design.html',
    styleUrls: ['./menu-design.css']
})
export class MenuDesignComponent implements OnInit {
    menus: any[] = [];
    filteredMenus: any[] = [];
    user: any = {};
    loading: boolean = true;
    recommendedCalories: number | null = null;

    // Weekly Planner State
    days: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    weeklyPlan: any = {}; // Map day -> plan object
    selectedDay: string | null = null;
    menuDialog: boolean = false;

    // Filter & Sort State
    searchText: string = '';
    selectedType: string | null = null;
    sortKey: string | null = null;
    sortOrder: number = 0;
    sortField: string = '';
    layout: 'list' | 'grid' = 'grid';

    typeOptions: any[] = [
        { label: 'Todos', value: null },
        { label: 'Omnívoro', value: 'omnivora' },
        { label: 'Vegetariano', value: 'vegetariana' }
    ];

    sortOptions: any[] = [
        { label: 'Calorías: Menor a Mayor', value: 'calories' },
        { label: 'Calorías: Mayor a Menor', value: '!calories' }
    ];

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.authService.currentUser.subscribe(user => {
            if (user) {
                this.user = user;
                this.recommendedCalories = user.target_calories;
                this.loadMenus();
                this.loadWeeklyPlan();
            }
        });
    }

    loadMenus() {
        this.loading = true;
        this.http.get<any[]>('http://localhost:8000/api/menus').subscribe({
            next: (data) => {
                this.menus = data;
                this.filteredMenus = [...this.menus];
                this.loading = false;
            },
            error: (error) => {
                console.error('Error fetching menus', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los menús' });
                this.loading = false;
            }
        });
    }

    loadWeeklyPlan() {
        this.http.get<any[]>('http://localhost:8000/api/weekly-plans').subscribe({
            next: (plans) => {
                // Convert array to map for easier access
                this.weeklyPlan = {};
                plans.forEach(plan => {
                    this.weeklyPlan[plan.day] = plan;
                });
            },
            error: (error) => {
                console.error('Error fetching weekly plan', error);
            }
        });
    }

    applyFilters() {
        let tempMenus = [...this.menus];

        // Filter by Type
        if (this.selectedType) {
            tempMenus = tempMenus.filter(menu => menu.type === this.selectedType);
        }

        // Filter by Search Text (Name or Ingredients)
        if (this.searchText) {
            const query = this.searchText.toLowerCase();
            tempMenus = tempMenus.filter(menu =>
                menu.name.toLowerCase().includes(query) ||
                menu.breakfast.toLowerCase().includes(query) ||
                menu.lunch.toLowerCase().includes(query) ||
                menu.dinner.toLowerCase().includes(query) ||
                menu.snack.toLowerCase().includes(query)
            );
        }

        // Sort
        if (this.sortField) {
            tempMenus.sort((a, b) => {
                let value1 = a[this.sortField];
                let value2 = b[this.sortField];
                let result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
                return result * this.sortOrder;
            });
        }

        this.filteredMenus = tempMenus;
    }

    onSortChange(event: any) {
        let value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }

        this.applyFilters();
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

    isRecommended(menuCalories: number): boolean {
        if (!this.recommendedCalories) return false;
        // Recommended if within +/- 200 calories
        return Math.abs(menuCalories - this.recommendedCalories) <= 200;
    }

    openMenuSelection(day: string) {
        this.selectedDay = day;
        this.menuDialog = true;
        // Reset filters when opening dialog
        this.searchText = '';
        this.selectedType = null;
        this.sortKey = null;
        this.filteredMenus = [...this.menus];
    }

    selectMenuForDay(menu: any) {
        if (!this.selectedDay) return;

        const payload = {
            day: this.selectedDay,
            menu_id: menu.id
        };

        this.http.post('http://localhost:8000/api/weekly-plans', payload).subscribe({
            next: (plan: any) => {
                this.weeklyPlan[this.selectedDay!] = plan;
                this.messageService.add({ severity: 'success', summary: 'Menú Asignado', detail: `Menú asignado para el ${this.selectedDay} ` });
                this.menuDialog = false;
            },
            error: (error) => {
                console.error('Error saving plan', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo asignar el menú' });
            }
        });
    }

    getPlanForDay(day: string) {
        return this.weeklyPlan[day];
    }
}
