import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { IMessage } from '../models/IMessage';
import { ITopic } from '../models/ITopic';
import { IParticipants } from '../models/IParticipants';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly apiUrl: string = environment.apiUrl;
  private socket: Socket | null = null;
  public inTopic: boolean;
  public isMobile: boolean;
  public topicId: string;
  public topics: BehaviorSubject<ITopic[]> = new BehaviorSubject<ITopic[]>([]);
  public topicMessages: BehaviorSubject<IMessage[]> = new BehaviorSubject<IMessage[]>([]);
  public topicParticipants: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private httpClient: HttpClient,
    private router: Router) {
    this.setupSocket();

    this.isMobile = window.innerWidth <= 992;

    window.onresize = () => {
      this.isMobile = window.innerWidth <= 992;
    };
  }

  private setupSocket() {
    const token = localStorage.getItem('auth_token');
    // console.log('connect token', token);
    if (token) {
      this.socket = io(this.apiUrl.split('/api')[0], {
        auth: {
          token: token,
        },
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
        this.setupListeners();
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('topicsUpdated', (topics: ITopic[]) => {
      this.topics.next(topics);
    });

    this.socket.on('messages', (messages: IMessage[]) => {
      this.topicMessages.next(messages);
    });

    this.socket.on('message', (message: IMessage) => {
      this.topicMessages.next([...this.topicMessages.value, message]);
    });

    this.socket.on('participantsUpdated', (participants: IParticipants) => {
      this.topicParticipants.next(participants);
    });

    this.socket.on('topicCreated', (topic: ITopic) => {
      console.log('join topic');
      this.joinTopic(topic.id);
    });
  }

  disconnectSocket() {
    if (this.socket) {
      if (this.inTopic) {
        this.leaveTopic(this.topicId);
      }

      this.socket.disconnect();
      this.socket = null;
    }
  }

  reconnectSocket() {
    this.disconnectSocket();
    this.setupSocket();
  }

  fetchTopics() {
    return this.httpClient.get<ITopic[]>(`${this.apiUrl}/chat/topics`, {
      withCredentials: true,
    }).pipe(tap((topics) => this.topics.next(topics)));
  }

  createTopic(topicName: string, privacyState: boolean, myId: string) {
    this.socket!.emit('createTopic', topicName, privacyState, myId);
  }

  fetchTopicMessages(topicId: string) {
    return this.httpClient.get<ITopic>(`${this.apiUrl}/chat/topics/${topicId}`);
  }

  joinTopic(topicId: string): void {
    if (this.topicId) {
      this.leaveTopic(this.topicId);
    }

    this.socket!.emit('joinTopic', topicId);
    this.inTopic = true;
    this.topicId = topicId;

    this.router.navigate(['chat', 'view'], { queryParams: { topicId } });
  }

  getTopicByRoomCode(roomCode: string): Promise<{topic: ITopic}> {
    return this.httpClient.get<{topic: ITopic}>(`${this.apiUrl}/chat/roomCode/${roomCode}`).toPromise() as Promise<{topic: ITopic}>;
  }

  leaveTopic(topicId: string): void {
    this.socket!.emit('leaveTopic', topicId);
    this.topicMessages.next([]);
    this.topicId = '';
    this.inTopic = false;
  }

  sendMessage(topicId: string, text: string): void {
    const message = { topicId, text, timestamp: Date.now() };
    this.socket!.emit('message', message);
  }
}
