import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpHandlerFn } from '@angular/common/http'
import { map } from 'rxjs/operators'

const _isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?Z$/

function convertDates(body: any) {
  if (body === null || typeof body !== 'object') {
    return body
  }

  for (const key of Object.keys(body)) {
    const value = body[key]
    if (typeof value === 'string' && _isoDateFormat.test(value)) {
      body[key] = new Date(value)
    } else if (typeof value === 'object') {
      convertDates(value) // Recursively convert nested objects
    }
  }
}

export function JsonDateParser(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  return next(req).pipe(
    map((val: HttpEvent<any>) => {
      if (val instanceof HttpResponse) {
        convertDates(val.body)
      }
      return val
    })
  )
}
