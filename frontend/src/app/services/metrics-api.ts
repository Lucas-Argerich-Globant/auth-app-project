import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { AdminMetrics, UserMetrics } from '../types/metrics'
import { map, Observable } from 'rxjs'
import { ApiResponse } from '../types/auth'

const api_url = 'http://localhost:3000/api'

/**
 * API service for retrieving application metrics.
 *
 * Provides:
 * - User-level metrics
 * - Admin-level metrics
 *
 * This service is stateless and performs simple response mapping.
 */
@Injectable({ providedIn: 'root' })
export class MetricsApi {
  private http = inject(HttpClient)

  /**
   * Retrieves metrics for the currently authenticated user.
   *
   * @returns Observable<UserMetrics | null>
   * - `UserMetrics` when the request succeeds
   * - `null` when the API responds with an error status
   */
  getUserMetrics(): Observable<UserMetrics | null> {
    return this.http.get<ApiResponse<UserMetrics>>(`${api_url}/metrics/user`).pipe(
      map((res) => {
        if (res.status === 'success') return res.data
        return null
      })
    )
  }

  /**
   * Retrieves admin metrics.
   *
   * Intended for admin-level users only.
   *
   * @returns Observable<AdminMetrics | null>
   * - `AdminMetrics` when the request succeeds
   * - `null` when the API responds with an error status
   */
  getAdminMetrics(): Observable<AdminMetrics | null> {
    return this.http.get<ApiResponse<AdminMetrics>>(`${api_url}/metrics/admin`).pipe(
      map((res) => {
        if (res.status === 'success') return res.data
        return null
      })
    )
  }
}
