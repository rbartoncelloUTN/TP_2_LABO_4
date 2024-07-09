import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDataComponent } from './modal-data.component';

describe('ModalDataComponent', () => {
  let component: ModalDataComponent;
  let fixture: ComponentFixture<ModalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
