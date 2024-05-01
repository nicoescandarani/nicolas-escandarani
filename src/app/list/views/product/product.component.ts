import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpService } from '../../services/http/http.service';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, switchMap, map, catchError, takeUntil } from 'rxjs/operators';
import { Product } from '../../interfaces/product';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribeComponent } from 'src/app/helpers/auto-unsubscribe/auto-unsubscribe.component';
import { StateService } from 'src/app/services/state/state.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent extends AutoUnsubscribeComponent implements OnInit {
  fg!: FormGroup;
  date_revision: string = '';
  private destroy$ = new Subject<void>();
  passedProductId: string = '';
  product: Product | null = null;

  constructor(private fb: FormBuilder, private httpService: HttpService, private router: Router, private activatedRoute: ActivatedRoute, private stateService: StateService) {
    super();
    const activatedRouteSubscription$ = this.activatedRoute.params
      .pipe(
        switchMap(({id}) => {
          if (id) {
            return of({id});
          } else {
            return of(null);
          }
        }
      )
    ).subscribe((data) => {
      if (data) {
        this.passedProductId = data?.id;
        this.getProduct(this.passedProductId);
      }
    });
    this.subscriptions.push(activatedRouteSubscription$);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(passedProduct?: Product): void {
    this.fg = this.fb.group({
      id: [{
        value: passedProduct ? passedProduct.id : '',
        disabled: !!passedProduct // Deshabilitar si existe passedProduct
      }, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10)
      ], [this.validateIdNotTaken.bind(this)]],
      name: [passedProduct ? passedProduct.name : '', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]],
      description: [passedProduct ? passedProduct.description : '', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]],
      logo: [passedProduct ? passedProduct.logo : '', [Validators.required]],
      date_release: [passedProduct ? this.formatDateFromISO(passedProduct.date_release) : '', [Validators.required, this.validateReleaseDate.bind(this)]]
    });

    // Actualizar date_revision inmediatamente si passedProduct contiene una fecha de lanzamiento
    if (passedProduct && passedProduct.date_release) {
      this.updateDateRevision(this.formatDateFromISO(passedProduct.date_release));
    }

    // Escuchar cambios en date_release
    this.fg.get('date_release')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(date => {
      this.updateDateRevision(date);
    });
  }

  updateDateRevision(date: string): void {
    if (date) {
      const oneYearLater = this.calculateOneYearLater(date);
      this.date_revision = oneYearLater; // Formatea a DD/MM/YYYY
    } else {
      this.date_revision = ''; // Limpiar si la fecha no es válida
    }
  }

  getProduct(id: string): void {
    const productsSubscription$ = this.httpService.getProducts().subscribe(products => {
      this.product = this.filterSingleProductById(products, id);
      if (this.product) {
        this.initForm(this.product);
      }
    });
    this.subscriptions.push(productsSubscription$);
  }

  filterSingleProductById(products: Product[], id: string): Product | null {
    return products.find(product => product.id === id) || null;
  }

  calculateOneYearLater(dateStr: string): string {
    const inputDate = this.parseDateFromString(dateStr);
    if (inputDate) {
      inputDate.setFullYear(inputDate.getFullYear() + 1);
      return this.formatDate(inputDate);
    }
    return '';
  }

  // Convertir una fecha ISO a formato DD/MM/YYYY
  formatDateFromISO(isoDateStr: string): string {
    const date = new Date(isoDateStr);
    if (!isNaN(date.getTime())) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    return '';
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses en JavaScript son 0-indexados
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  parseDateFromString(dateStr: string): Date | null {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Ajustar porque los meses en JavaScript son de 0 a 11
        const year = parseInt(parts[2], 10);

        // Crear un objeto Date con año, mes y día
        const date = new Date(year, month, day);
        // Comprobación adicional para evitar fechas inválidas como 31 de febrero
        if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
            return date;
        }
    }
    return null; // Retornar null si la fecha es inválida
  }

  validateReleaseDate(control: AbstractControl): ValidationErrors | null {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalizar la fecha actual para eliminar la hora

    if (!control.value) {
        return { dateInvalid: 'La fecha es requerida.' };
    }

    const inputDate = this.parseDateFromString(control.value);

    if (!inputDate) {
        return { dateInvalid: 'La fecha ingresada no es válida.' };
    }

    if (inputDate < currentDate) {
        return { dateInvalid: 'La fecha de liberación debe ser igual o mayor a la fecha actual.' };
    }

    return null;
  }

  validateIdNotTaken(control: AbstractControl): Observable<ValidationErrors | null> {
    return of(control.value).pipe(
      debounceTime(700),
      switchMap(value => {
        if (!value) return of(null);
        return this.httpService.checkIdAvailability(value).pipe(
          map(isTaken => isTaken ? { idTaken: 'Este ID ya está en uso.' } : null),
          catchError(() => of(null))  // Assuming simple error handling
        );
      })
    );
  }

  getErrorMessage(controlName: string): string {
    const control = this.fg.get(controlName);
    if (control && control.touched && control.errors) {
      if (control.hasError('required')) return 'Este campo es obligatorio.';
      if (control.hasError('minlength')) return `Debe tener al menos ${control.getError('minlength').requiredLength} caracteres.`;
      if (control.hasError('maxlength')) return `No puede tener más de ${control.getError('maxlength').requiredLength} caracteres.`;
      if (control.hasError('idTaken')) return 'Este ID ya está en uso.';
      if (control.hasError('dateInvalid')) return control.getError('dateInvalid');
      if (control.hasError('dateMismatch')) return 'La fecha de revisión debe ser exactamente un año después de la fecha de liberación.';
    }
    return '';
  }

  formatDateToISO(dateInput: string) {
    const date = new Date(dateInput);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  }

  buildProduct(passedProduct?: boolean): Product {
    return {
      id: passedProduct ? this.passedProductId :this.fg.get('id')?.value,
      name: this.fg.get('name')?.value,
      description: this.fg.get('description')?.value,
      logo: this.fg.get('logo')?.value,
      date_release: this.formatDateToISO(this.fg.get('date_release')?.value),
      date_revision: this.formatDateToISO(this.date_revision)
    };
  }

  handleResetForm(): void {
    this.fg.reset();
  }

  handleSubmitForm(): void {
    if (this.fg.valid) {
      if (this.passedProductId) {
        // Modify product.
        this.httpService.editProduct(this.buildProduct(true)).subscribe(() => {
          this.stateService.snackbarConfigSet = {
            message: 'Producto modificado exitosamente.',
            show: true,
            type: 'success'
          }
          // this.router.navigate(['/']);
        });
      } else {
        // Create product.
        const product = this.buildProduct();
        this.httpService.createProduct(product).subscribe(() => {
          this.stateService.snackbarConfigSet = {
            message: 'Producto creado exitosamente.',
            show: true,
            type: 'success'
          }
            this.handleResetForm();
            this.router.navigate(['/']);
          },
          error => console.warn('Error creando producto:', error)
        );
      }
    }
  }

  override ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
