import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-initial-screen',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './initial-screen.component.html',
  styleUrl: './initial-screen.component.scss'
})
export class InitialScreenComponent {
  navState: boolean = false;

  constructor(private router: Router) {
  }

  async onNavigate(route: string) {
    await this.router.navigate(['auth', route]);
  }

  onToggleNavState() {
    this.navState = !this.navState;
  }
}
