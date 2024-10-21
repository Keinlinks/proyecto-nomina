import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../../environment';
export function urlInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {

  let apiUrl = environment.apiUrl;
  req = req.clone({
    url: apiUrl + req.url
  });
  return next(req);
}
