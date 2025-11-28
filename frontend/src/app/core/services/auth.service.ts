import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor() {
        const storedUser = localStorage.getItem('user');
        this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    public getToken(): string | null {
        return localStorage.getItem('token');
    }

    updateUser(user: any, token?: string) {
        localStorage.setItem('user', JSON.stringify(user));
        if (token) {
            localStorage.setItem('token', token);
        }
        this.currentUserSubject.next(user);
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }
}
