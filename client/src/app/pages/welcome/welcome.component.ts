import { Component, OnInit } from '@angular/core';
import { FeaturedRoomCardComponent } from "../../components/featured-room-card/featured-room-card.component";
import { ChatService } from '../../services/chat.service';
import { ITopic } from '../../models/ITopic';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TruncatePipe } from "../../pipes/truncate.pipe";
import { SpinnerComponent } from "../../components/spinner/spinner.component";
import { CreateTopicModalComponent } from "../../components/create-topic-modal/create-topic-modal.component";
import { Router } from '@angular/router';
import { Filter } from 'bad-words';
import { EToastTypes, ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [FeaturedRoomCardComponent, NgFor, NgIf, FormsModule, TruncatePipe, SpinnerComponent, CreateTopicModalComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent implements OnInit {
  private profanityFilter: Filter = new Filter();
  protected rooms: ITopic[];
  protected isCreateRoomModalOpen: boolean;
  protected promptInput: string;
  protected isChatroomPublic: boolean = true;

  constructor(private chatService: ChatService,
              private authService: AuthService,
              private toastService: ToastService,
              private router: Router) { }

  public ngOnInit(): void {
    this.getFeaturedTopics();
  }

  protected onCreateRoom(): void {
    console.log(this.promptInput, this.isChatroomPublic);

    if (!this.promptInput || !this.promptInput.length) return;

    if (this.profanityFilter.isProfane(this.promptInput)) {
      this.toastService.showToast(EToastTypes.warning, "Profanity words are not allowed!");
      return;
    }

    this.chatService.createTopic(this.promptInput, this.isChatroomPublic, this.authService.user._id);
  }

  protected onJoinRoom(room: ITopic): void {
    this.router.navigate(['chat', 'view'], {
      queryParams: { topicId: room.id }
    });
  }

  protected isUserLoaded(): boolean {
    return !!this.authService.user;
  }

  protected getUsername(): string {
    return this.authService.username;
  }

  protected getFeaturedTopics(): void {
    this.chatService.getTopics().subscribe((topics: ITopic[]) => {
      this.rooms = topics.sort((a, b) => b.participants.length - a.participants.length);
    });
  }

  protected getEmptyRoom(): ITopic {
    return {} as ITopic;
  }
}