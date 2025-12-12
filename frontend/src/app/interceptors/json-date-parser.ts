import { HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http'
import { map } from 'rxjs/operators'

/**
 * Regular expression to match ISO 8601 UTC date strings.
 * 
 * Example format:
 * - `2024-01-01T12:34:56Z`
 * - `2024-01-01T12:34:56.123Z`
 */
const _isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?Z$/

/**
 * Recursively processes an object or array, converting ISO 8601 date strings
 * into JavaScript `Date` objects.
 * 
 * This function mutates the provided `body` object in-place.
 *
 * @param {any} body The response body to process. Can be an object, array, or primitive.
 */
function convertDates(body: any): void {
  // If the body is null or already a Date, no need to process
  if (body === null || body instanceof Date) {
    return
  }

  // Handle arrays explicitly (including arrays of date strings)
  if (Array.isArray(body)) {
    for (let i = 0; i < body.length; i++) {
      const value = body[i]
      
      // If an element is an ISO date string, convert to Date object
      if (typeof value === 'string' && _isoDateFormat.test(value)) {
        body[i] = new Date(value)
      } else {
        convertDates(value) // Recursively process nested arrays/objects
      }
    }
    return
  }

  // If the body is not an object, return (e.g., for primitive types like numbers or strings)
  if (typeof body !== 'object') {
    return
  }

  // Process object properties recursively
  for (const key of Object.keys(body)) {
    const value = body[key]

    // If a value is an ISO date string, convert it to a Date object
    if (typeof value === 'string' && _isoDateFormat.test(value)) {
      body[key] = new Date(value)
    } else {
      convertDates(value) // Recursively process nested objects
    }
  }
}

/**
 * HTTP interceptor that converts ISO 8601 date strings in JSON responses
 * to JavaScript `Date` objects. It recursively processes the response body
 * to handle nested objects and arrays.
 *
 * **Important**:
 * - This interceptor processes **only HTTP responses**.
 * - It **mutates the response body** in-place without cloning.
 * - Only matches **UTC (`Z`) ISO date strings**.
 *
 * @param {HttpRequest<unknown>} req The incoming HTTP request.
 * @param {HttpHandlerFn} next The next function in the interceptor chain.
 * @returns {Observable<HttpEvent<any>>} The HTTP event with the processed response body.
 */
export function JsonDateParser(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  return next(req).pipe(
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // Process response body and convert date strings to Date objects
        convertDates(event.body)
      }
      return event
    })
  )
}
