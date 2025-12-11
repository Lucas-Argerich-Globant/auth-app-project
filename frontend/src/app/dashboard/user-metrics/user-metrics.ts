import { Component, computed, inject } from '@angular/core'
import { MetricsApi } from '../metrics-api'
import { rxResource } from '@angular/core/rxjs-interop'

@Component({
  selector: 'user-metrics',
  templateUrl: './user-metrics.html'
})
export class UserMetrics {
  protected metricsApi = inject(MetricsApi)

  private metricsResource = rxResource({
    stream: () => {
      return this.metricsApi.getUserMetrics()
    }
  })

  protected metrics = computed(() => this.metricsResource.value())
}
