import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {ITopic} from "../../../../services/chat.service";
import {NgClass, NgIf} from "@angular/common";
import {AuthService} from "../../../../services/auth.service";
import {TimeAgoPipe} from "../../../../services/time-ago.pipe";

@Component({
  selector: 'app-topic-item',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    TimeAgoPipe
  ],
  templateUrl: './topic-item.component.html',
  styleUrl: './topic-item.component.scss'
})
export class TopicItemComponent {
  @Input() topic: ITopic;

  constructor(private router: Router) {
  }

  async onOpenTopic() {
    await this.router.navigate(['chat', 'view'], {queryParams: {topicId: this.topic.id}});
  }
}
