import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http/http.service';
import { ProductComponent } from './product.component';
import { Observable, of, Subject } from 'rxjs';
import { Product } from '../../interfaces/product';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let mockHttpService: jasmine.SpyObj<HttpService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(waitForAsync(() => {
    mockHttpService = jasmine.createSpyObj('HttpService', ['getProducts', 'createProduct', 'editProduct', 'deleteProduct']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      params: of({id: '1'})
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ ProductComponent ],
      providers: [
        FormBuilder,
        { provide: HttpService, useValue: mockHttpService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {snapshot: {params: {id: '1'}}} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product data on init if id is present', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Test Product',
      description: 'This is a test product',
      logo: 'test_logo.png',
      date_release: '2022-01-01',
      date_revision: '2023-01-01'
    };
    mockHttpService.getProducts.and.returnValue(of([mockProduct]));
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.product).toEqual(mockProduct);
    expect(component.fg.value).toEqual({
      id: mockProduct.id,
      name: mockProduct.name,
      description: mockProduct.description,
      logo: mockProduct.logo,
      date_release: component.formatDateFromISO(mockProduct.date_release)
    });
  });

  it('should call the correct service method when submitting form based on edit/create mode', () => {
    component.handleResetForm();
    component.handleSubmitForm();
    expect(mockHttpService.createProduct).toHaveBeenCalledTimes(0); // Ensure no calls if form is invalid.

    component.fg.setValue({
      id: '2',
      name: 'New Product',
      description: 'New Description',
      logo: 'new_logo.png',
      date_release: '2022-02-02'
    });
    component.handleSubmitForm();
    fixture.detectChanges();

    expect(mockHttpService.createProduct).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate back after product creation', () => {
    component.handleSubmitForm();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/list/create']);
  });
});
