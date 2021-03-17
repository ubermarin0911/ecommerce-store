import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent,HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { public_key } from '../../../../wompi_keys/public_key';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  token = localStorage.getItem('token');
  wompiUrl = environment.wompiUrl;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    req = this.addAuthenticationToken(req);

    return next.handle(req);
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    if (!this.token) {
      return request;
    }

    if (request.url.includes(this.wompiUrl)) {
      return request.clone({
        headers: request.headers.set("Authorization", `Bearer ${public_key}`)
      });
    }

    return request.clone({
      headers: request.headers.set("Authorization", `Bearer ${this.token}` )
    });
  }
}
