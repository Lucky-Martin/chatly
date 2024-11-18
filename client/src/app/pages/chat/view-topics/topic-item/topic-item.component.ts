import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { TimeAgoPipe } from '../../../../services/time-ago.pipe';
import { TruncatePipe } from '../../../../pipes/truncate.pipe';
import { ITopic } from '../../../../models/ITopic';
import { ChatService } from '../../../../services/chat.service';

@Component({
  selector: 'app-topic-item',
  standalone: true,
  imports: [NgIf, NgClass, TimeAgoPipe, TruncatePipe],
  templateUrl: './topic-item.component.html',
  styleUrl: './topic-item.component.scss',
})
export class TopicItemComponent {
  @Input() topic: ITopic;

  constructor(private router: Router, private chatService: ChatService) {}

  async onOpenTopic() {
    if (this.chatService.inTopic && this.chatService.topicId === this.topic.id) return;

    if (this.chatService.inTopic) {
      this.chatService.leaveTopic(this.chatService.topicId);
    }

    await this.router.navigate(['chat', 'view'], {
      queryParams: { topicId: this.topic.id },
    });
  }
}
