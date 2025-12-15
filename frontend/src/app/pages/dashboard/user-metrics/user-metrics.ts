import { Component, computed, inject } from '@angular/core'
import { MetricsApi } from '../../../services/metrics-api'
import { rxResource } from '@angular/core/rxjs-interop'
import { MetricCell } from '../metric-cell/metric-cell'
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'user-metrics',
  imports: [MetricCell],
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

  protected arrowRightIcon = faArrowRightArrowLeft
}
