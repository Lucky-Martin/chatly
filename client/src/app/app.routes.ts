import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { InitialScreenComponent } from './pages/auth/initial-screen/initial-screen.component';
import { ChatComponent } from './pages/chat/chat.component';
import { AuthGuard } from './services/auth.guard';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { ConversationComponent } from './pages/conversation/conversation.component';
import { SelectInterestsComponent } from './pages/auth/select-interests/select-interests.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', pathMatch: 'full', component: InitialScreenComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'interests', component: SelectInterestsComponent },
    ],
  },
  { path: 'home', redirectTo: 'chat' },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'welcome' },
      { path: 'welcome', component: WelcomeComponent },
      { path: 'view', component: ConversationComponent },
    ],
  },
];
