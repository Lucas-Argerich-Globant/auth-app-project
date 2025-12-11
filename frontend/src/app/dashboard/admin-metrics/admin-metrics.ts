import { Component, computed, inject, signal } from '@angular/core'
import { MetricsApi } from '../metrics-api'
import { rxResource } from '@angular/core/rxjs-interop'

@Component({
  selector: 'admin-metrics',
  templateUrl: './admin-metrics.html'
})
export class AdminMetrics {
  private metricsApi = inject(MetricsApi)

  private metricsResource = rxResource({
    stream: () => {
      return this.metricsApi.getAdminMetrics()
    }
  })

  protected metrics = computed(() => this.metricsResource.value())
}
