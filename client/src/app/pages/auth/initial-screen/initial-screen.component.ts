import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-initial-screen',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './initial-screen.component.html',
  styleUrl: './initial-screen.component.scss'
})
export class InitialScreenComponent {
  constructor(private router: Router) {
  }

  async onNavigate(route: string) {
    await this.router.navigate(['auth', route]);
  }
}
