import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ChatService } from "../chat.service";
import { IUser } from "../../models/IUser";
import { environment } from "../../environments/environment";
import { ILoginCredentials, ISignupCredentials } from "../../models/ICredentials";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public username: string;
  public user: IUser;
  private authStatus = new BehaviorSubject<boolean>(false);
  private initialAuthCheck = false;
  private readonly AUTH_TOKEN_KEY: string = 'auth_token';
  private readonly apiUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient,
              private chatService: ChatService,
              private router: Router) {
  }

  public async checkInitialLoginStatus() {
    if (this.initialAuthCheck) return;
    this.initialAuthCheck = true;

    this.httpClient.get<{
      token: string,
      user: any
    }>(`${this.apiUrl}/auth/profile`, {withCredentials: true}).subscribe(
      async res => {
        await this.processSuccessAuth(res);
      },
      async err => {
        console.error("Initial auth status", err);
        this.authStatus.next(false);
      }
    );
  }

  public signup(credentials: ISignupCredentials) {
    return this.httpClient.post<{ token: string, user: any }>(`${this.apiUrl}/auth/signup`, {
      username: credentials.username,
      email: credentials.email,
      password: credentials.password
    });
  }

  public updateUserInterests(interests: string[]) {
    return this.httpClient.patch(`${this.apiUrl}/auth/profile`, {interests}, {withCredentials: true}).pipe(
      tap((response: any) => {
        if (response.user) {
          this.user = response.user;
          this.username = response.user.username;
          localStorage.setItem('user-json', JSON.stringify(response.user));
        }
      })
    );
  }

  public login(credentials: ILoginCredentials) {
    return this.httpClient.post<{
      token: string,
      user: any
    }>(`${this.apiUrl}/auth/login`, credentials, {withCredentials: true});
  }

  public fetchUser() {
    return this.httpClient.get(`${this.apiUrl}/auth/profile`, {withCredentials: true});
  }

  public fetchAndUpdateUser() {
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

  public async processSuccessAuth(res: any) {
    await this.storeToken(res.token);
    this.authStatus.next(true);
    if (typeof res.user === 'string') {
      res.user = JSON.parse(res.user);
    }

    localStorage.setItem('user-json', JSON.stringify(res.user));
    this.chatService.reconnect();
    await this.router.navigateByUrl('home', {replaceUrl: true});
  }

  public async logout() {
    if (this.chatService.currentTopicId) {
      this.chatService.leaveTopic(this.chatService.currentTopicId);
    }

    localStorage.clear();
    this.chatService.disconnect();

    this.authStatus.next(false);
    await this.router.navigateByUrl('/auth', {replaceUrl: true});
  }

  public isValidEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  private async storeToken(token: string) {
    if (!token) return;
    localStorage.setItem(this.AUTH_TOKEN_KEY, token);
  }
}
