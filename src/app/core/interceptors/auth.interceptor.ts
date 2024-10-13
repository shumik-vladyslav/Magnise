import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getTokenFromLoacalStorage();
    const tokenType = this.authService.getTokenTypeFromLoacalStorage();
    
    request = request.clone({
      setHeaders: {
        'Authorization': `${tokenType} ${token}`,
      }
    });
    
    return next.handle(request)
  }
}
