import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-searchbar-filter',
  standalone: true,
  imports: [],
  templateUrl: './searchbar-filter.component.html',
  styleUrl: './searchbar-filter.component.scss'
})
export class SearchbarFilterComponent {
  @ViewChild("searchbarInput") searchbarInput: ElementRef<HTMLInputElement>;
  @Output() changeQuery: EventEmitter<string> = new EventEmitter<string>();
  private queryInput: string;
  private debounce: number = 200;
  private timer: ReturnType<typeof setTimeout> | null;

  public onKeyPressed(): void {
    this.queryInput = this.searchbarInput.nativeElement.value;

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.changeQuery.emit(this.queryInput);
      this.timer = null;
    }, this.debounce);
  }
}
