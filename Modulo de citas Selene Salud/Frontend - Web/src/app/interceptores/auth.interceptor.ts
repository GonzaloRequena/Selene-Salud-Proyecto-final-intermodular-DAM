import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('selene_token'); 

  // LOGS DE CONTROL
  console.log('[Interceptor] Capturando petición a:', req.url);
  console.log('[Interceptor] ¿Token en LocalStorage?:', token ? 'SÍ (existe)' : 'NO (es NULL)');

  if (token) {
    const clonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('[Interceptor] Token inyectado en las cabeceras.');
    return next(clonada);
  }

  console.warn('[Interceptor] Enviando petición SIN token de autorización.');
  return next(req);
};