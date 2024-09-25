import { Injectable } from '@angular/core';

export enum EToastTypes {
  warning = "toast-warning"
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastTimeout: number = 5000;
  public toastText: any = {};
  public currentToastElement: HTMLElement | null;

  constructor() { }

  public showToast(toastType: EToastTypes, text: string): void {
    if (this.currentToastElement) return;

    const toast = document.getElementById(toastType);
    if (!toast) return;

    this.currentToastElement = toast;
    this.toastText[toastType] = text;

    toast.classList.remove('toast-hidden');
    toast.classList.add('toast-visible');

    setTimeout(this.hideToast.bind(this, toast), this.toastTimeout);
  }

  public hideToast(toastElement: HTMLElement): void {    
    toastElement.classList.remove('toast-visible');
    toastElement.classList.add('toast-hidden');
    this.currentToastElement = null;
  }
}
