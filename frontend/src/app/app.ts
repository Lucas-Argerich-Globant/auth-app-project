import { Component, inject, signal } from '@angular/core'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { AuthStore } from './auth/auth-store'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html'
})
export class App {
  protected authStore = inject(AuthStore)
  protected router = inject(Router)

  logout() {
    this.authStore.logout()
    this.router.navigateByUrl('/')
  }
}
