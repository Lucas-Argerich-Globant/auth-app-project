import { describe, it, expect, beforeEach } from 'vitest'
import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import { MetricsApi } from './metrics-api'
import { ApiResponse } from '../types/auth'
import { UserMetrics, AdminMetrics } from '../types/metrics'

const api_url = 'http://localhost:3000/api'

describe('MetricsApi', () => {
  let service: MetricsApi
  let http: HttpTestingController

  const mockUserMetrics: UserMetrics = {
    lastLogin: new Date('2024-01-01T12:00:00Z'),
    logins: {
      successful: 10,
      unsuccessful: 3
    }
  }

  const mockAdminMetrics: AdminMetrics = {
    account: {
      total: 500,
      active: 420
    },
    logins: {
      successful: {
        total: 1000
      },
      unsuccessful: {
        total: 200,
        accountNotFound: 50,
        incorrectPassword: 150
      }
    }
  }

  beforeEach(() => {
    service = TestBed.inject(MetricsApi)
    http = TestBed.inject(HttpTestingController)
  })

  // ---------------------------------------------------
  // USER METRICS
  // ---------------------------------------------------
  it('should get user metrics (success)', () => {
    service.getUserMetrics().subscribe((result) => {
      expect(result).toEqual(mockUserMetrics)
    })

    const req = http.expectOne(`${api_url}/metrics/user`)
    expect(req.request.method).toBe('GET')

    req.flush({
      status: 'success',
      data: mockUserMetrics
    } satisfies ApiResponse<UserMetrics>)
  })

  it('should return null if user metrics returns error', () => {
    service.getUserMetrics().subscribe((result) => {
      expect(result).toBeNull()
    })

    const req = http.expectOne(`${api_url}/metrics/user`)

    req.flush({
      status: 'error',
      message: 'Something failed'
    } satisfies ApiResponse<UserMetrics>)
  })

  // ---------------------------------------------------
  // ADMIN METRICS
  // ---------------------------------------------------
  it('should get admin metrics (success)', () => {
    service.getAdminMetrics().subscribe((result) => {
      expect(result).toEqual(mockAdminMetrics)
    })

    const req = http.expectOne(`${api_url}/metrics/admin`)
    expect(req.request.method).toBe('GET')

    req.flush({
      status: 'success',
      data: mockAdminMetrics
    } satisfies ApiResponse<AdminMetrics>)
  })

  it('should return null if admin metrics returns error', () => {
    service.getAdminMetrics().subscribe((result) => {
      expect(result).toBeNull()
    })

    const req = http.expectOne(`${api_url}/metrics/admin`)

    req.flush({
      status: 'error',
      message: 'Admin metrics unavailable'
    } satisfies ApiResponse<AdminMetrics>)
  })
})
