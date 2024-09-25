import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  credentialsError: boolean;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) {}

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

      this.authService.login(loginData).subscribe(async res => {
        await this.authService.processSuccessAuth(res);
      }, err => {
        this.credentialsError = true;
        console.log(err);
      })
    }
  }
}
