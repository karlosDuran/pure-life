import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';

import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MenubarModule,
    BreadcrumbModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    BadgeModule
  ],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayoutComponent implements OnInit {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  breadcrumbs: MenuItem[] | undefined;
  user: any = {};

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.user = user || {};
    });

    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/admin/dashboard'
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-users',
        routerLink: '/admin/users'
      },
      {
        label: 'Roles',
        icon: 'pi pi-id-card',
        routerLink: '/admin/roles'
      },
      {
        label: 'Menús',
        icon: 'pi pi-list',
        routerLink: '/admin/menus'
      }
    ];

    this.home = { icon: 'pi pi-home', routerLink: ['/admin/dashboard'] };

    // Listen to route changes to update breadcrumbs
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      });

    // Initial breadcrumb generation
    this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: MenuItem[] = []): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'];
      if (label) {
        breadcrumbs.push({ label, routerLink: url });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  logout() {
    // Implement logout logic here
    console.log('Logging out...');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
