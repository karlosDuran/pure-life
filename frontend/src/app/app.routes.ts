import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';
import { DashboardComponent } from './features/admin/dashboard/dashboard';
import { UsersComponent } from './features/admin/users/users';
import { ProfileComponent } from './features/admin/profile/profile';
import { MenusComponent } from './features/admin/menus/menus';
import { RolesComponent } from './features/admin/roles/roles';
import { UserLayoutComponent } from './layouts/user-layout/user-layout';
import { NutritionistLayoutComponent } from './layouts/nutritionist-layout/nutritionist-layout';
import { CalculationComponent } from './features/user/calculation/calculation';
import { PreferencesComponent } from './features/user/preferences/preferences';
import { MenuDesignComponent } from './features/user/menu-design/menu-design';
import { NutritionistMenusComponent } from './features/nutritionist/menus/nutritionist-menus';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role.guard';
import { redirectGuard } from './core/guards/redirect.guard';

export const routes: Routes = [
    { path: '', canActivate: [redirectGuard], children: [] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['admin'] },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent, data: { breadcrumb: 'Dashboard' } },
            { path: 'users', component: UsersComponent, data: { breadcrumb: 'Usuarios' } },
            { path: 'profile', component: ProfileComponent, data: { breadcrumb: 'Mi Perfil' } },
            { path: 'menus', component: MenusComponent, data: { breadcrumb: 'Menús' } },
            { path: 'roles', component: RolesComponent, data: { breadcrumb: 'Roles' } }
        ]
    },
    {
        path: 'nutritionist',
        component: NutritionistLayoutComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['nutriologo'] },
        children: [
            { path: '', redirectTo: 'menus', pathMatch: 'full' },
            { path: 'menus', component: NutritionistMenusComponent, data: { breadcrumb: 'Menús' } },
            { path: 'profile', component: ProfileComponent, data: { breadcrumb: 'Mi Perfil' } }
        ]
    },
    {
        path: 'user',
        component: UserLayoutComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['usuario'] },
        children: [
            { path: '', redirectTo: 'calculation', pathMatch: 'full' },
            { path: 'calculation', component: CalculationComponent, data: { breadcrumb: 'Cálculo' } },
            { path: 'preferences', component: PreferencesComponent, data: { breadcrumb: 'Preferencias' } },
            { path: 'menu-design', component: MenuDesignComponent, data: { breadcrumb: 'Diseñar Menú' } },
            { path: 'profile', component: ProfileComponent, data: { breadcrumb: 'Mi Perfil' } }
        ]
    }
];
