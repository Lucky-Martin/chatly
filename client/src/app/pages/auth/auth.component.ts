import { Component } from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  imports: [
    RouterOutlet
  ],
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
}
