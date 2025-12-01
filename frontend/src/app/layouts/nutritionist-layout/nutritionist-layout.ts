import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-nutritionist-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MenubarModule,
        AvatarModule,
        BadgeModule,
        BreadcrumbModule
    ],
    templateUrl: './nutritionist-layout.html',
    styleUrls: ['./nutritionist-layout.css']
})
export class NutritionistLayoutComponent implements OnInit {
    items: MenuItem[] | undefined;
    user: any;
    breadcrumbs: MenuItem[] | undefined;
    home: MenuItem | undefined;

    constructor(
        private authService: AuthService,
        private router: Router,
        private http: HttpClient,
        private cd: ChangeDetectorRef
    ) {
        this.user = this.authService.currentUserValue;
    }

    ngOnInit() {
        this.http.get<any[]>('http://localhost:8000/api/navigation').subscribe({
            next: (data) => {
                this.items = data.map(item => ({
                    label: item.label,
                    icon: item.icon,
                    routerLink: item.routerLink
                }));
                // Add Logout
                this.items.push({
                    label: 'Cerrar Sesión',
                    icon: 'pi pi-power-off',
                    command: () => this.logout(),
                    styleClass: 'ml-auto text-red-500'
                });
                this.cd.detectChanges(); // Fix ExpressionChangedAfterItHasBeenCheckedError
            },
            error: (err) => console.error('Error loading navigation', err)
        });

        this.home = { icon: 'pi pi-home', routerLink: '/nutritionist/menus' };

        // Listen to route changes to update breadcrumbs (simplified)
        this.router.events.subscribe(() => {
            this.updateBreadcrumbs();
        });
        this.updateBreadcrumbs();
    }

    updateBreadcrumbs() {
        const route = this.router.url.split('/').pop();
        let label = 'Menús';
        if (route === 'profile') label = 'Mi Perfil';

        this.breadcrumbs = [{ label: label }];
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
