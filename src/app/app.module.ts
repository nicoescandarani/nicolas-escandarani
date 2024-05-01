import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HeaderInterceptor } from './list/interceptors/header/header.interceptor';
import { AutoUnsubscribeComponent } from './helpers/auto-unsubscribe/auto-unsubscribe.component';
import { HeaderComponent } from './standalone-components/header/header.component';
import { SpinnerComponent } from './ui-components/spinner/spinner.component';
import { LoadingInterceptor } from './interceptors/loading/loading.interceptor';
import { SnackBarComponent } from './ui-components/snack-bar/snack-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    AutoUnsubscribeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HeaderComponent,
    SpinnerComponent,
    SnackBarComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
