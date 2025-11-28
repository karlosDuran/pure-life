import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const userString = localStorage.getItem('user');

    if (!userString) {
        router.navigate(['/login']);
        return false;
    }

    const user = JSON.parse(userString);
    const expectedRoles = route.data['roles'] as Array<string>;

    if (expectedRoles && expectedRoles.includes(user.role)) {
        return true;
    } else {
        // Redirect based on role to prevent infinite loops or unauthorized access pages
        if (user.role === 'admin' || user.role === 'nutriologo') {
            router.navigate(['/admin/dashboard']);
        } else {
            router.navigate(['/user/calculation']);
        }
        return false;
    }
};
