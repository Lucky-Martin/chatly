import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import { Router } from "@angular/router";
import {ChatService} from "./chat.service";
import { IUser } from "../models/IUser";
import { environment } from "../environments/environment";
import { ILoginCredentials, ISignupCredentials } from "../models/ICredentials";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(false);
  private initialAuthCheck = false;
  private readonly AUTH_TOKEN_KEY: string = 'auth_token';
  private readonly apiUrl: string = environment.apiUrl;
  username: string;
  user: IUser;

  constructor(private httpClient: HttpClient,
              private chatService: ChatService,
              private router: Router) { }

  get getAuthState(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  private async storeToken(token: string) {
    if (!token) return;
    localStorage.setItem(this.AUTH_TOKEN_KEY, token);
  }

  async checkInitialLoginStatus() {
    if (this.initialAuthCheck) return;
    this.initialAuthCheck = true;

    this.httpClient.get<{
      token: string,
      user: any
    }>(`${this.apiUrl}/auth/status`, {withCredentials: true}).subscribe(
      async res => {
        await this.processSuccessAuth(res);
      },
      async err => {
        console.error("Initial auth status", err);
        this.authStatus.next(false);
      }
    );
  }

  signup(credentials: ISignupCredentials) {
    return this.httpClient.post<{ token: string, user: any }>(`${this.apiUrl}/auth/signup`, {
      username: credentials.username,
      email: credentials.email,
      password: credentials.password
    });
  }

  login(credentials: ILoginCredentials) {
    return this.httpClient.post<{ token: string, user: any }>(`${this.apiUrl}/auth/login`, credentials, {withCredentials: true});
  }

  fetchUser() {
    return this.httpClient.get(`${this.apiUrl}/auth/profile`, {withCredentials: true});
  }

  updateUser() {
    return new Promise<boolean>((resolve, reject) => {
      this.fetchUser().subscribe(res => {
        if ((res as any).user as IUser) {
          this.username = (res as any).user.username;
          this.user = (res as any).user;
          this.authStatus.next(true)
        }
        resolve(true);
      }, err => {
        console.log(err);
        reject(false)
      });
    })
  }

  async processSuccessAuth(res: any) {
    await this.storeToken(res.token);
    this.authStatus.next(true);
    if (typeof res.user === 'string') {
      res.user = JSON.parse(res.user);
    }

    localStorage.setItem('user-json', JSON.stringify(res.user));
    this.chatService.reconnectSocket();
    await this.router.navigateByUrl('home', {replaceUrl: true});
  }

  async logout() {
    if (this.chatService.topicId) {
      this.chatService.leaveTopic(this.chatService.topicId);
    }

    localStorage.clear();
    this.chatService.disconnectSocket();

    this.authStatus.next(false);
    await this.router.navigateByUrl('/auth', { replaceUrl: true });
  }

  isValidEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }
}
