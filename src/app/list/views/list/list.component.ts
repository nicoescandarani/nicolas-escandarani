import { Component } from '@angular/core';
import { HttpService } from '../../services/http/http.service';
import { Product } from '../../interfaces/product';
import { AutoUnsubscribeComponent } from 'src/app/helpers/auto-unsubscribe/auto-unsubscribe.component';
import { ProductsAmount } from '../../enums/products-amount';
import { Router } from '@angular/router';
import { StateService } from 'src/app/services/state/state.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends AutoUnsubscribeComponent {
  amountOptions: ProductsAmount[] = this.getEnumValues();
  products: Product[] = [];
  shownProducts: Product[] = [];
  totalFilteredProducts: Product[] = [];
  productsAmount: ProductsAmount = ProductsAmount.FIVE; // Normally this variable would be passed to the service to bring only the amount of products needed but that functionality does not exist and I do not have access to the project so I simply bring everything and show the desired amount of products.
  selectedProductId: string = '';
  filterText: string = '';

  currentPage: number = 1;
  totalPages: number = 0;

  constructor(private httpService: HttpService, private router: Router, private stateService: StateService) {
    super();
  }

  ngOnInit(): void {
    this.getProducts();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateShownProducts();
  }

  updateShownProducts(): void {
    const startIndex = (this.currentPage - 1) * this.productsAmount;
    const endIndex = startIndex + this.productsAmount;
    this.shownProducts = this.totalFilteredProducts.slice(startIndex, endIndex);
  }

  filterProducts(): void {
    this.totalFilteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
      product.description.toLowerCase().includes(this.filterText.toLowerCase())
    );
    this.totalPages = Math.ceil(this.totalFilteredProducts.length / this.productsAmount);
    this.currentPage = 1; // Reset to first page after filtering.
    this.updateShownProducts();
  }

  getProducts() {
    const productsSubscription$ = this.httpService.getProducts().subscribe(products => {
      this.products = products;
      this.filterProducts();  // Refilter products after getting them.
    });
    this.subscriptions.push(productsSubscription$);
  }

  handleCreateProduct(): void {
    this.router.navigate(['/list/create']);
  }
  getEnumValues(): number[] {
    return Object.values(ProductsAmount).filter(value => typeof value === 'number') as number[];
  }

  onAmountChange(newAmount: number): void {
    this.productsAmount = newAmount as ProductsAmount;
    this.filterProducts();  // This ensures that the products are refiltered and readjusted.
  }

  setProductsByAmount(products: Product[], amount: number): Product[] {
    return products.slice(0, amount);
  }

  handleCancelDelete(): void {
    this.selectedProductId = '';
  }

  handleConfirmDelete(): void {
    if (this.selectedProductId) {
      this.httpService.deleteProduct(this.selectedProductId).subscribe(() => {
        this.getProducts();
        this.stateService.snackbarConfigSet = {
          message: 'Producto eliminado exitosamente.',
          show: true,
          type: 'success'
        }
        this.selectedProductId = '';
      });
    }
  }

  handleEditProduct(id: string): void {
    console.log('Edit product with id:', id);

    this.router.navigate([`/list/product/${id}`]);
  }

  handleDeleteProduct(id: string): void {
    this.selectedProductId = id;
  }
}
