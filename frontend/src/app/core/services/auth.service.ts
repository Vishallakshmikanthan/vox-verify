import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8000/auth'; // FastAPI backend
    private tokenKey = 'vox_token';

    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        const token = this.getToken();
        if (token) {
            // detailed verification skipped for MVP
            this.currentUserSubject.next({ token });
        }
    }

    register(user: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, user);
    }

    login(credentials: any): Observable<any> {
        // Adjusting to sending JSON as per backend implementation
        return this.http.post(`${this.apiUrl}/login/json`, credentials).pipe(
            tap((response: any) => {
                if (response.access_token) {
                    this.setToken(response.access_token);
                    this.currentUserSubject.next({ token: response.access_token });
                }
            })
        );
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        this.currentUserSubject.next(null);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    private setToken(token: string) {
        localStorage.setItem(this.tokenKey, token);
    }
}
