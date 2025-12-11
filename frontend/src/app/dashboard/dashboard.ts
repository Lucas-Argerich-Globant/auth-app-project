import { Component, inject } from '@angular/core'
import { AuthStore } from '../auth/auth-store'
import { UserMetrics } from "./user-metrics/user-metrics";
import { AdminMetrics } from "./admin-metrics/admin-metrics";

@Component({
  templateUrl: './dashboard.html',
  imports: [UserMetrics, AdminMetrics]
})
export class Dashboard {
  private authStore = inject(AuthStore)
  protected user = this.authStore.user()
}
