import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http/http.service';
import { Observable, of } from 'rxjs';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockHttpService: jasmine.SpyObj<HttpService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockHttpService = jasmine.createSpyObj('HttpService', ['getProducts', 'deleteProduct']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [ ListComponent ],
      providers: [
        { provide: HttpService, useValue: mockHttpService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;

    // Mock response for getProducts
    mockHttpService.getProducts.and.returnValue(of([{ id: '1', name: 'Product 1', description: 'Description 1', logo: 'a', date_release: '2024-05-02', date_revision: '2025-05-02'}]));

    fixture.detectChanges();  // trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(mockHttpService.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(1);
  });

  it('should navigate to create product page', () => {
    component.handleCreateProduct();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/list/create']);
  });

  it('should filter products correctly', () => {
    component.products = [
      {
        id: '1',
        name: 'Product 1',
        description: 'Nice',
        logo: 'a',
        date_release: '2024-05-02',
        date_revision: '2025-05-02'
      },
      {
        id: '2',
        name: 'Product 2',
        description: 'Better',
        logo: 'a',
        date_release: '2024-05-02',
        date_revision: '2025-05-02'
      }
    ];
    component.filterText = 'nice';
    component.filterProducts();

    expect(component.shownProducts.length).toBe(1);
    expect(component.shownProducts[0].name).toContain('Product 1');
  });

  it('should handle amount change correctly', () => {
    component.products = [
      {
        id: '1',
        name: 'Product 1',
        description: 'Nice',
        logo: 'a',
        date_release: '2024-05-02',
        date_revision: '2025-05-02'
      },
      {
        id: '2', name: 'Product 2', description: 'Better',
        logo: 'a',
        date_release: '2024-05-02',
        date_revision: '2025-05-02'
      },
      {
        id: '3', name: 'Product 3', description: 'Best',
        logo: 'a',
        date_release: '2024-05-02',
        date_revision: '2025-05-02'
      }
    ];
    component.onAmountChange(2);

    expect(component.shownProducts.length).toBe(2);
  });

  it('should delete a product and reload products', () => {
    const deleteSpy = mockHttpService.deleteProduct.and.returnValue(of());
    component.selectedProductId = '1';

    component.handleConfirmDelete();

    expect(deleteSpy).toHaveBeenCalledWith('1');
    expect(mockHttpService.getProducts).toHaveBeenCalledTimes(2);  // Called again after deletion
  });
});
