import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-user-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, AvatarModule, MenubarModule],
    templateUrl: './user-layout.html',
    styleUrls: ['./user-layout.css']
})
export class UserLayoutComponent implements OnInit {
    items: MenuItem[] | undefined;
    user: any = {};

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.authService.currentUser.subscribe(user => {
            this.user = user || {};
        });

        this.items = [
            {
                label: 'Cálculo',
                icon: 'pi pi-calculator',
                routerLink: '/user/calculation'
            },
            {
                label: 'Preferencias',
                icon: 'pi pi-heart',
                routerLink: '/user/preferences'
            },
            {
                label: 'Diseñar Menú',
                icon: 'pi pi-list',
                routerLink: '/user/menu-design'
            }
        ];
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
