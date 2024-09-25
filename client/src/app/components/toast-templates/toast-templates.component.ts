import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { EToastTypes } from '../../services/toast.service';

@Component({
  selector: 'app-toast-templates',
  standalone: true,
  imports: [],
  templateUrl: './toast-templates.component.html',
  styleUrl: './toast-templates.component.scss'
})
export class ToastTemplatesComponent implements OnInit {
  public EToastTypes = EToastTypes;

  constructor(public toastService: ToastService) { }

  ngOnInit(): void {
    setTimeout(() => {
      document.getElementsByClassName("toast-wrapper-hidden")[0].classList.remove("toast-wrapper-hidden");
    }, 1000);
  }
}
