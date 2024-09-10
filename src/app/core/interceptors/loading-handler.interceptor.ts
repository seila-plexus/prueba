import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { inject } from '@angular/core';

let totalRequests = 0;

export const loadingHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  totalRequests++;
  loadingService.setLoading(true);
  return next(req).pipe(
    finalize(() =>{
      totalRequests--;
      if (totalRequests ==0){
        loadingService.setLoading(false);
      }
    })
  );
};