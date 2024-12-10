import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, map } from "rxjs";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { NgClass, NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-searchbar-dropdown',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    NgClass
  ],
  templateUrl: './searchbar-dropdown.component.html',
  styleUrl: './searchbar-dropdown.component.scss'
})
export class SearchbarDropdownComponent implements OnInit {
  @Output() itemsChanged: EventEmitter<string[]> = new EventEmitter();
  private readonly predefinedItems: string[] = [
    'technology', 'sports', 'music', 'travel', 'food', 'art',
    'books', 'movies', 'gaming', 'fashion', 'photography', 'science'
  ];

  public searchControl = new FormControl('');
  public filteredItems: string[] = [];
  public showDropdown = false;
  public selectedItems: string[] = [];

  ngOnInit(): void {
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(value => value?.toLowerCase() || '')
    ).subscribe(searchTerm => {
      this.filterItems(searchTerm);
    });
  }

  private filterItems(searchTerm: string): void {
    this.filteredItems = this.predefinedItems.filter(item =>
      item.toLowerCase().includes(searchTerm)
    );
  }

  public selectItem(item: string): void {
    if (!this.isItemSelected(item) && this.selectedItems.length < 10) {
      this.selectedItems.push(item);
      this.searchControl.setValue('', { emitEvent: false });
    }
    this.itemsChanged.emit(this.selectedItems);
  }

  public removeItem(item: string): void {
    this.selectedItems = this.selectedItems.filter(i => i !== item);
  }

  public isItemSelected(item: string): boolean {
    return this.selectedItems.includes(item);
  }

  public onBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  public onShowDropdown(): void {
    this.showDropdown = true;
    this.filterItems("");
  }
}
