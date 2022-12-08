
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import { AuthInterceptorService } from './auth-interceptor.service';
import { CacheInterceptor } from './cache-interceptor.service';

export const interceptorProviders = [
    { 
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptorService,
        multi: true
    }
    // ,{ 
    //     provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true 
    // }
]