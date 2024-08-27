import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ApiResponse } from 'src/common/dto'

@Injectable()
export class ResponseFormatInterceptor<T> implements NestInterceptor<T, any> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const res = new ApiResponse()
        res.code = 200
        res.data = data
        res.success = true
        res.message = 'Success'
        return res
      }),
    )
  }
}
