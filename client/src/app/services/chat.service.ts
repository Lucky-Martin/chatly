import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { IMessage } from '../models/IMessage';
import { ITopic } from '../models/ITopic';
import { IParticipants } from '../models/IParticipants';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public currentTopicId: string = '';
  private readonly MOBILE_BREAKPOINT: number = 992;
  public readonly isMobile$ = new BehaviorSubject<boolean>(window.innerWidth <= this.MOBILE_BREAKPOINT);
  private readonly apiUrl: string = environment.apiUrl;
  private socket: Socket | null = null;
  private readonly topicsSubject = new BehaviorSubject<ITopic[]>([]);
  public readonly topics$ = this.topicsSubject.asObservable();
  private readonly messagesSubject = new BehaviorSubject<IMessage[]>([]);
  public readonly messages$ = this.messagesSubject.asObservable();
  private readonly participantsSubject = new BehaviorSubject<string[]>([]);
  public readonly participants$ = this.participantsSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    this.initializeService();
  }

  public disconnect(): void {
    if (this.socket) {
      if (this.currentTopicId) {
        this.leaveTopic(this.currentTopicId);
      }
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public reconnect(): void {
    this.disconnect();
    this.initializeSocket();
  }

  public getTopics(): Observable<ITopic[]> {
    return this.http.get<ITopic[]>(`${this.apiUrl}/chat/topics`, {withCredentials: true}).pipe(tap((res) => {
      this.topicsSubject.next(res);
    }));
  }

  public createTopic(topicName: string, interests: string[], isPrivate: boolean, userId: string): void {
    this.socket?.emit('createTopic', topicName, interests, isPrivate, userId);
  }

  public editTopicInterests(topicId: string, interests: string[]) {
    return this.http.patch(`${this.apiUrl}/chat/topics/${topicId}`, {interests}, {withCredentials: true})
  }

  public async getTopicByRoomCode(roomCode: string): Promise<ITopic | undefined> {
    const response = await this.http.get<{ topic: ITopic }>(`${this.apiUrl}/chat/roomCode/${roomCode}`).toPromise();
    return response?.topic;
  }

  public getTopicMessages(topicId: string): Observable<ITopic> {
    return this.http.get<ITopic>(`${this.apiUrl}/chat/topics/${topicId}`);
  }

  public joinTopic(topicId: string): void {
    if (this.currentTopicId) {
      this.leaveTopic(this.currentTopicId);
    }

    this.socket?.emit('joinTopic', topicId);
    this.currentTopicId = topicId;
    this.router.navigate(['chat', 'view'], {queryParams: {topicId}});
  }

  public leaveTopic(topicId: string): void {
    this.socket?.emit('leaveTopic', topicId);
    this.messagesSubject.next([]);
    this.currentTopicId = '';
  }

  public sendMessage(topicId: string, text: string): void {
    const message = {topicId, text, timestamp: Date.now()};
    this.socket?.emit('message', message);
  }

  private initializeService(): void {
    this.initializeSocket();
    this.setupResizeListener();
  }

  private initializeSocket(): void {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const socketUrl = this.apiUrl.split('/api')[0];
    this.socket = io(socketUrl, {auth: {token}});

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.setupSocketListeners();
    });

    this.socket.on('disconnect', () => console.log('Socket disconnected'));
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('topicsUpdated', (topics: ITopic[]) =>
      this.topicsSubject.next(topics));

    this.socket.on('messages', (messages: IMessage[]) =>
      this.messagesSubject.next(messages));

    this.socket.on('message', (message: IMessage) =>
      this.messagesSubject.next([...this.messagesSubject.value, message]));

    this.socket.on('participantsUpdated', (participants: IParticipants) =>
      this.participantsSubject.next(participants));

    this.socket.on('topicCreated', (topic: ITopic) =>
      this.joinTopic(topic.id));
  }

  private setupResizeListener(): void {
    window.addEventListener('resize', () => {
      this.isMobile$.next(window.innerWidth <= this.MOBILE_BREAKPOINT);
    });
  }
}
