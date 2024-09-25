import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  loginForm: FormGroup;
  canSubmit: boolean;
  emailErrorMessage: string;
  passwordErrorMessage: string;
  credentialsError: boolean;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService) {}

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

      this.authService.signup(loginData).subscribe(async res => {
        await this.authService.processSuccessAuth(res);
      }, err => {
        if (err.error.message.includes('unique')) {
          this.emailErrorMessage = 'Email already in use!';
        } else {
          this.credentialsError = true;
        }
        console.log(err);
      });
    }
  }

  validateCanSubmit() {
    const username = this.loginForm.get('username')?.value;
    const email = this.loginForm.get('email');
    const pass = this.loginForm.get('password');
    const confirmPass = this.loginForm.get('confirmPassword');

    if (!this.authService.isValidEmail(email?.value) && email?.value.length) {
      this.emailErrorMessage = 'Please enter a valid email';
      this.canSubmit = false;
    } else {
      this.emailErrorMessage = '';
    }

    if (pass?.value.length) {
      if (!pass?.valid && pass?.value.length) {
        this.passwordErrorMessage = "Password must be atleast 8 characters"
        this.canSubmit = false;
      } else if (pass.value !== confirmPass?.value) {
        this.passwordErrorMessage = "Passwords don't match"
        this.canSubmit = false;
      } else {
        this.passwordErrorMessage = '';
      }
    }

    if (!this.emailErrorMessage && !this.passwordErrorMessage
      && email?.value.length && pass?.value.length && username.length) {
      this.canSubmit = true;
    }
  }

  async onReturn() {
    await this.router.navigate(['auth']);
  }
}
