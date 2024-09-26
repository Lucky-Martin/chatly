import { Component, EventEmitter, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ViewTopicsComponent} from "./view-topics/view-topics.component";
import {Router, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";
import { IUser } from "../../models/IUser";

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
  topicModalOpened: EventEmitter<void> = new EventEmitter();

  constructor(public authService: AuthService) {
  }

  ngOnInit() {
    this.authService.fetchUser().subscribe(res => {
      if ((res as any).user as IUser) {
        this.authService.username = (res as any).user.username;
        this.authService.user = (res as any).user;
      }
    }, err => {
      console.log(err);
    });
  }

  onOpenTopicModal() {
    this.topicModalOpened.next();
  }

  async onLogout() {
    await this.authService.logout();
  }
}
