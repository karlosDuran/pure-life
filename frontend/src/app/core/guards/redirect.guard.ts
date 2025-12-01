import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const redirectGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const userString = localStorage.getItem('user');

    if (userString) {
        const user = JSON.parse(userString);
        if (user.role === 'admin') {
            router.navigate(['/admin/dashboard']);
        } else if (user.role === 'nutriologo') {
            router.navigate(['/nutritionist/menus']);
        } else {
            router.navigate(['/user/calculation']);
        }
        return false;
    }

    router.navigate(['/login']);
    return false;
};
