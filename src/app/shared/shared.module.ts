import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { CoreModule } from '../core/core.module';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { ErrorComponent } from './components/error/error.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NfcComponent } from './components/nfc/nfc.component';
import { PinComponent } from './components/pin/pin.component';
import { QrCodeComponent } from './components/qr-code/qr-code.component';
import { NumericDirective } from './directives/numeric.directive';


@NgModule({
  declarations: [QrCodeComponent, NfcComponent, PinComponent, NumericDirective, LoaderComponent, ErrorPageComponent, ErrorComponent],
  imports: [CommonModule, CoreModule, MatInputModule, MatSelectModule, ReactiveFormsModule, ZXingScannerModule],
  exports: [LoaderComponent, ErrorComponent]
})
export class SharedModule {}
