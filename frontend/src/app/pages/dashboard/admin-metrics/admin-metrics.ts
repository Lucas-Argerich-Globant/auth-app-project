import { Component, computed, inject } from '@angular/core'
import { MetricsApi } from '../../../services/metrics-api'
import { rxResource } from '@angular/core/rxjs-interop'
import { MetricCell } from "../metric-cell/metric-cell";
import { faArrowUpFromWaterPump } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'admin-metrics',
  templateUrl: './admin-metrics.html',
  imports: [MetricCell]
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
