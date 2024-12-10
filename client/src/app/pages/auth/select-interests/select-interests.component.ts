import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { EToastTypes, ToastService } from "../../../services/toast.service";

interface Interest {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-select-interests',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './select-interests.component.html',
  styleUrl: './select-interests.component.scss'
})
export class SelectInterestsComponent implements OnInit {
  public interestForm: FormGroup;
  public interests: Interest[] = [
    { id: 'technology', name: 'Technology', icon: 'fas fa-laptop-code' },
    { id: 'sports', name: 'Sports', icon: 'fas fa-football-ball' },
    { id: 'music', name: 'Music', icon: 'fas fa-music' },
    { id: 'travel', name: 'Travel', icon: 'fas fa-plane' },
    { id: 'food', name: 'Food', icon: 'fas fa-utensils' },
    { id: 'art', name: 'Art', icon: 'fas fa-palette' },
    { id: 'books', name: 'Books', icon: 'fas fa-book' },
    { id: 'movies', name: 'Movies', icon: 'fas fa-film' },
    { id: 'gaming', name: 'Gaming', icon: 'fas fa-gamepad' },
    { id: 'fashion', name: 'Fashion', icon: 'fas fa-tshirt' },
    { id: 'photography', name: 'Photography', icon: 'fas fa-camera' },
    { id: 'science', name: 'Science', icon: 'fas fa-flask' }
  ];
  private selectedInterests: Set<string> = new Set<string>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) { }

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
        this.toastService.showToast(EToastTypes.warning, "Error while saving interests");
        console.warn(err);
      }
    );
  }
}
