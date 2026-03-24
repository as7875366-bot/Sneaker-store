import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductdataComponent } from './productdata.component';

describe('ProductdataComponent', () => {
  let component: ProductdataComponent;
  let fixture: ComponentFixture<ProductdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductdataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
