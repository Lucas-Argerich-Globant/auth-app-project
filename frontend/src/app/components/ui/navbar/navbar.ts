import { Component, inject } from '@angular/core'
import { AuthStore } from '../../../services/auth-store'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'

@Component({
  selector: 'navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html'
})
export class Navbar {
  protected authStore = inject(AuthStore)
  protected router = inject(Router)

  logout() {
    this.authStore.logout()
    this.router.navigateByUrl('/')
  }
}
