import { Component } from '@angular/core';
import { HttpService } from '../../services/http/http.service';
import { Product } from '../../interfaces/product';
import { AutoUnsubscribeComponent } from 'src/app/helpers/auto-unsubscribe/auto-unsubscribe.component';
import { ProductsAmount } from '../../enums/products-amount';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends AutoUnsubscribeComponent {
  amountOptions: ProductsAmount[] = this.getEnumValues();
  products: Product[] = [];
  shownProducts: Product[] = [];
  productsAmount: ProductsAmount = ProductsAmount.FIVE; // Normalmente esta variable se pasaría al servicio para traer solamente la cantidad de productos que se necesitan pero no existe esa funcionalidad y no tengo acceso al proyecto entonces simplemente traigo todo y muestro la cantidad deseada de productos.
  selectedProductId: string = '';
  filterText: string = '';

  constructor(private httpService: HttpService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.getProducts();
  }

  filterProducts(): void {
    let filteredProducts = this.products;

    // Filtrar productos por texto
    if (this.filterText) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
        product.description.toLowerCase().includes(this.filterText.toLowerCase())
      );
    }

    // Luego ajustar la cantidad de productos mostrados basado en `productsAmount`
    this.shownProducts = this.setProductsByAmount(filteredProducts, this.productsAmount);
  }

  getProducts() {
    const productsSubscription$ = this.httpService.getProducts().subscribe(products => {
      this.products = products;
      this.filterProducts();  // Refiltrar productos después de obtenerlos
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
    this.filterProducts();  // Esto asegura que los productos se refiltren y reajusten
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
