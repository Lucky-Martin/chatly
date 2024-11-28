import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarConversationsComponent } from './sidebar-conversations.component';

describe('SidebarConversationsComponent', () => {
  let component: SidebarConversationsComponent;
  let fixture: ComponentFixture<SidebarConversationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarConversationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarConversationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
