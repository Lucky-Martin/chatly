import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { io, Socket } from "socket.io-client";
import { BehaviorSubject } from "rxjs";

export interface IMessage {
  user: string;
  text: string;
  timestamp: number;
}

export interface ITopic {
  id: string;
  name: string;
  messages: IMessage[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly apiUrl: string = 'http://localhost:8000/api';
  private socket: Socket | null = null;
  topics: ITopic[] = [];
  topicMessages = new BehaviorSubject<IMessage[]>([]);

  constructor(private httpClient: HttpClient) {
    this.setupSocket();
  }

  private setupSocket() {
    const token = localStorage.getItem('auth_token');
    console.log('connect token', token);
    if (token) {
      this.socket = io(this.apiUrl.split('/api')[0], {
        auth: {
          token: token
        }
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
    this.socket!.on('topicsUpdated', (topics: ITopic[]) => {
      console.log('new topics', topics);
      this.topics = topics;
    });

    this.socket!.on('messages', (messages: IMessage[]) => {
      this.topicMessages.next(messages);
    });

    this.socket!.on('message', (message: IMessage) => {
      this.topicMessages.next([...this.topicMessages.value, message]);
    });
  }

  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  reconnectSocket() {
    this.disconnectSocket();
    this.setupSocket();
  }

  getTopics() {
    return this.httpClient.get<ITopic[]>(`${this.apiUrl}/chat/topics`, { withCredentials: true });
  }

  createTopic(topicName: string) {
    this.socket!.emit('createTopic', topicName);
  }

  fetchTopicMessages(topicId: string) {
    return this.httpClient.get<ITopic>(`${this.apiUrl}/chat/topics/${topicId}`);
  }

  joinTopic(topicId: string): void {
    this.socket!.emit('joinTopic', topicId);
  }

  leaveTopic(topicId: string): void {
    this.socket!.emit('leaveTopic', topicId);
    this.topicMessages.next([]);
  }

  sendMessage(topicId: string, text: string): void {
    const message = { topicId, text, timestamp: Date.now() };
    this.socket!.emit('message', message);
  }
}
