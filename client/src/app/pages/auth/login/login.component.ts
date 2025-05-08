import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";
import {AuthService} from "../../../services/auth/auth.service";
import { EToastTypes, ToastService } from '../../../services/toast.service';
import { SpinnerComponent } from "../../../components/spinner/spinner.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language/language.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    SpinnerComponent,
    TranslateModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  credentialsError: boolean;
  isLoading: boolean;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private toastService: ToastService,
              private translateService: TranslateService,
              private languageService: LanguageService) {
    // Ensure language is properly set
    const currentLang = this.languageService.getCurrentLanguage();
    console.log('Login component: setting language to', currentLang);
    this.translateService.use(currentLang);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  async onReturn() {
    await this.router.navigate(['auth']);
  }

  onSubmit(): void {
    this.credentialsError = false;

    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.isLoading = true;

      this.authService.login(loginData).subscribe(async res => {
        await this.authService.processSuccessAuth(res);
        this.isLoading = false;
      }, err => {
        this.credentialsError = true;
        this.isLoading = false;
        this.toastService.showToast(EToastTypes.warning, this.translateService.instant('errors.loginFailed'));
        console.log(err);
      })
    }
  }

  onNavigateSignup(event: Event) {
    event.preventDefault();
    this.router.navigate(['auth', 'signup']);
  }
}
