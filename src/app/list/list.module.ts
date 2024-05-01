import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './views/list/list.component';
import { ProductComponent } from './views/product/product.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ButtonComponent } from '../ui-components/button/button.component';
import { TableComponent } from '../ui-components/table/table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../ui-components/modal/modal.component';


@NgModule({
  declarations: [
    ListComponent,
    ProductComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    ListRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ButtonComponent,
    TableComponent,
    ModalComponent
  ]
})
export class ListModule { }
