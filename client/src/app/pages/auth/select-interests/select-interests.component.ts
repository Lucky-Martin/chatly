import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from "../../../services/auth/auth.service";
import { Router } from "@angular/router";
import { EToastTypes, ToastService } from "../../../services/toast.service";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language/language.service';

interface Interest {
  id: string;
  nameKey: string;
  icon: string;
}

@Component({
  selector: 'app-select-interests',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, TranslateModule],
  templateUrl: './select-interests.component.html',
  styleUrl: './select-interests.component.scss'
})
export class SelectInterestsComponent implements OnInit {
  public interestForm: FormGroup;
  public interests: Interest[] = [
    { id: 'technology', nameKey: 'interests.technology', icon: 'fas fa-laptop-code' },
    { id: 'sports', nameKey: 'interests.sports', icon: 'fas fa-football-ball' },
    { id: 'music', nameKey: 'interests.music', icon: 'fas fa-music' },
    { id: 'travel', nameKey: 'interests.travel', icon: 'fas fa-plane' },
    { id: 'food', nameKey: 'interests.food', icon: 'fas fa-utensils' },
    { id: 'art', nameKey: 'interests.art', icon: 'fas fa-palette' },
    { id: 'books', nameKey: 'interests.books', icon: 'fas fa-book' },
    { id: 'movies', nameKey: 'interests.movies', icon: 'fas fa-film' },
    { id: 'gaming', nameKey: 'interests.gaming', icon: 'fas fa-gamepad' },
    { id: 'fashion', nameKey: 'interests.fashion', icon: 'fas fa-tshirt' },
    { id: 'photography', nameKey: 'interests.photography', icon: 'fas fa-camera' },
    { id: 'science', nameKey: 'interests.science', icon: 'fas fa-flask' }
  ];
  private selectedInterests: Set<string> = new Set<string>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private translateService: TranslateService,
    private languageService: LanguageService
  ) {
    // Ensure language is properly set
    const currentLang = this.languageService.getCurrentLanguage();
    console.log('Interests component: setting language to', currentLang);
    this.translateService.use(currentLang);
  }

  public ngOnInit(): void {
    this.interestForm = this.fb.group({
      interests: [[], [Validators.required, Validators.minLength(3), Validators.maxLength(10)]]
    });
  }

  public get selectedCount(): number {
    return this.selectedInterests.size;
  }

  public get isValidSelection(): boolean {
    return this.selectedCount >= 3 && this.selectedCount <= 10;
  }

  public isSelected(id: string): boolean {
    return this.selectedInterests.has(id);
  }

  public toggleInterest(id: string): void {
    if (this.selectedInterests.has(id)) {
      this.selectedInterests.delete(id);
    } else if (this.selectedCount < 10) {
      this.selectedInterests.add(id);
    }
    this.interestForm.patchValue({ interests: Array.from(this.selectedInterests) });
  }

  public onSubmit(): void {
    if (!this.isValidSelection) return;

    this.authService.updateUserInterests(Array.from(this.selectedInterests)).subscribe(
      async () => {
        await this.router.navigate(['chat']);
      },
      (err: any) => {
        this.toastService.showToast(EToastTypes.warning, this.translateService.instant('errors.interestsSaveError'));
        console.warn(err);
      }
    );
  }
}
