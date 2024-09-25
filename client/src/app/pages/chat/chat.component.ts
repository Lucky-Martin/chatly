import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ViewTopicsComponent} from "./view-topics/view-topics.component";
import {Router, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ViewTopicsComponent,
    RouterOutlet,
    NgIf
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  constructor(public authService: AuthService) {
  }

  ngOnInit() {
    this.authService.fetchUser().subscribe(res => {
      if ((res as any).user) {
        this.authService.username = (res as any).user.username;
      }
    }, err => {
      console.log(err);
    });
  }

  async onLogout() {
    await this.authService.logout();
  }
}
