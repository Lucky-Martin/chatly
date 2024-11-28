import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbarFilterComponent } from './searchbar-filter.component';

describe('SearchbarFilterComponent', () => {
  let component: SearchbarFilterComponent;
  let fixture: ComponentFixture<SearchbarFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchbarFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchbarFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
