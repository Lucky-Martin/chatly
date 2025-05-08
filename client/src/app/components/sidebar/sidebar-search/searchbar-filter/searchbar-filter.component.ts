import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-searchbar-filter',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './searchbar-filter.component.html',
  styleUrl: './searchbar-filter.component.scss'
})
export class SearchbarFilterComponent {
  @ViewChild("searchbarInput") searchbarInput: ElementRef<HTMLInputElement>;
  @Output() changeQuery: EventEmitter<string> = new EventEmitter<string>();
  private queryInput: string;
  private debounce: number = 200;
  private timer: ReturnType<typeof setTimeout> | null;

  constructor(private translateService: TranslateService) {}

  public onKeyPressed(): void {
    const inputValue = this.searchbarInput?.nativeElement?.value || '';
    this.changeQuery.emit(inputValue);
  }
}
