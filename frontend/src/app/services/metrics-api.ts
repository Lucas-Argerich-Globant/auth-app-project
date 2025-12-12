import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { AdminMetrics, UserMetrics } from '../types/metrics'
import { map } from 'rxjs'
import { ApiResponse } from '../types/auth'

const api_url = 'http://localhost:3000/api'

@Injectable({ providedIn: 'root' })
export class MetricsApi {
  private http = inject(HttpClient)

  getUserMetrics() {
    return this.http.get<ApiResponse<UserMetrics>>(`${api_url}/metrics/user`).pipe(
      map((res) => {
        if (res.status === 'success') return res.data
        return null
      })
    )
  }

  getAdminMetrics() {
    return this.http.get<ApiResponse<AdminMetrics>>(`${api_url}/metrics/admin`).pipe(
      map((res) => {
        if (res.status === 'success') return res.data
        return null
      })
    )
  }
}
