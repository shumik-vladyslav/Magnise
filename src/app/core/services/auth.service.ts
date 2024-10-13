import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAuthResponse } from '../models/auth-response';
import { ENDPOINTS } from '../constants/endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpWithoutInterceptor: HttpClient;
  private url = environment.url;
  private grant_type = environment.grant_type;
  private client_id = environment.client_id;
  private username = environment.username;
  private password = environment.password;

  constructor(private http: HttpClient, private httpBackend: HttpBackend) {
    this.httpWithoutInterceptor = new HttpClient(httpBackend);
  }

  public getTokenFromLoacalStorage(): string {
    return localStorage.getItem('token') || '';
  }

  public getTokenTypeFromLoacalStorage(): string {
    return localStorage.getItem('token_type') || '';
  }

  public setTokenToLoacalStorage(token: string): void {
    localStorage.setItem('token', token);
  }

  public setTokenTypeToLoacalStorage(token_type: string): void {
    localStorage.setItem('token_type', token_type);
  }

  public getTokenFromPlatform() {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new HttpParams()
    .set('grant_type', this.grant_type)
    .set('client_id', this.client_id)
    .set('username', this.username)
    .set('password', this.password);

    return this.httpWithoutInterceptor
      .post<IAuthResponse>(
        this.url + ENDPOINTS.AUTH,
        body, { headers }
      )
      .pipe(
        tap((res) => {
          this.setTokenToLoacalStorage(res.access_token);
          this.setTokenTypeToLoacalStorage(res.token_type);
        })
      );
  }
}
