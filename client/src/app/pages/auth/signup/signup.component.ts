import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
import {NgIf} from "@angular/common";
import { EToastTypes, ToastService } from '../../../services/toast.service';
import { SpinnerComponent } from "../../../components/spinner/spinner.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language/language.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    SpinnerComponent,
    TranslateModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  loginForm: FormGroup;
  canSubmit: boolean;
  usernameErrorMessage: string;
  emailErrorMessage: string;
  passwordErrorMessage: string;
  credentialsError: boolean;
  isLoading: boolean;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private toastService: ToastService,
              private translateService: TranslateService,
              private languageService: LanguageService) {
    // Ensure language is properly set
    const currentLang = this.languageService.getCurrentLanguage();
    console.log('Signup component: setting language to', currentLang);
    this.translateService.use(currentLang);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    this.credentialsError = false;

    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.isLoading = true;

      this.authService.signup(loginData).subscribe(async res => {
        await this.authService.processSuccessAuth(res);
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        if (err.error.message.includes('unique')) {
          this.emailErrorMessage = this.translateService.instant('errors.emailInUse');
          this.toastService.showToast(EToastTypes.warning, this.emailErrorMessage);
        } else {
          this.credentialsError = true;
        }
        console.log(err);
      });
    }
  }

  onNavigateLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['auth', 'login']);
  }

  validateCanSubmit() {
    const username = this.loginForm.get('username')?.value;
    const email = this.loginForm.get('email');
    const pass = this.loginForm.get('password');
    const confirmPass = this.loginForm.get('confirmPassword');

    if (username && username.length < 4) {
      this.usernameErrorMessage = this.translateService.instant('errors.usernameLength');
      this.canSubmit = false;
      return;
    } else {
      this.usernameErrorMessage = '';
    }

    if (!this.authService.isValidEmail(email?.value) && email?.value.length) {
      this.emailErrorMessage = this.translateService.instant('errors.invalidEmail');
      this.canSubmit = false;
    } else {
      this.emailErrorMessage = '';
    }

    if (pass?.value.length) {
      if (!pass?.valid && pass?.value.length) {
        this.passwordErrorMessage = this.translateService.instant('errors.passwordLength');
        this.canSubmit = false;
      } else if (pass.value !== confirmPass?.value) {
        this.passwordErrorMessage = this.translateService.instant('errors.passwordMismatch');
        this.canSubmit = false;
      } else {
        this.passwordErrorMessage = '';
      }
    }

    if (!this.emailErrorMessage && !this.passwordErrorMessage && !this.usernameErrorMessage
      && email?.value.length && pass?.value.length && username.length) {
      this.canSubmit = true;
    }
  }

  async onReturn() {
    await this.router.navigate(['auth']);
  }
}
