<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NavigationController extends Controller
{
    public function getRoutes(Request $request)
    {
        $user = Auth::user();
        $role = $user->role;

        $routes = [];

        if ($role === 'admin') {
            $routes = [
                [
                    'label' => 'Dashboard',
                    'icon' => 'pi pi-home',
                    'routerLink' => '/admin/dashboard'
                ],
                [
                    'label' => 'Usuarios',
                    'icon' => 'pi pi-users',
                    'routerLink' => '/admin/users'
                ],
                [
                    'label' => 'Menús',
                    'icon' => 'pi pi-list',
                    'routerLink' => '/admin/menus'
                ],
                [
                    'label' => 'Roles',
                    'icon' => 'pi pi-id-card',
                    'routerLink' => '/admin/roles'
                ],
                [
                    'label' => 'Mi Perfil',
                    'icon' => 'pi pi-user',
                    'routerLink' => '/admin/profile'
                ]
            ];
        } elseif ($role === 'nutriologo') {
            $routes = [
                [
                    'label' => 'Menús',
                    'icon' => 'pi pi-list',
                    'routerLink' => '/nutritionist/menus'
                ],
                [
                    'label' => 'Mi Perfil',
                    'icon' => 'pi pi-user',
                    'routerLink' => '/nutritionist/profile'
                ]
            ];
        } elseif ($role === 'usuario') {
            $routes = [
                [
                    'label' => 'Cálculo',
                    'icon' => 'pi pi-calculator',
                    'routerLink' => '/user/calculation'
                ],
                [
                    'label' => 'Preferencias',
                    'icon' => 'pi pi-heart',
                    'routerLink' => '/user/preferences'
                ],
                [
                    'label' => 'Diseñar Menú',
                    'icon' => 'pi pi-list',
                    'routerLink' => '/user/menu-design'
                ],
                [
                    'label' => 'Mi Perfil',
                    'icon' => 'pi pi-user',
                    'routerLink' => '/user/profile'
                ]
            ];
        }

        return response()->json($routes);
    }
}
