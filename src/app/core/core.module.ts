import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { UtenteService } from './services/utente.service';
import { ContoService } from './services/conto.service';
import { PagamentoService } from './services/pagamento.service';
import { UtentiStore } from './stores/utenti.store';
import { ContiStore } from './stores/conti.store';
import { httpInterceptorProviders } from './http-interceptors/auth.interceptor';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, MatIconModule],
  exports: [MatIconModule],
  providers: [/* No providers */],
})
export class CoreModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    // aggiunge le nuova svg a material
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('assets/svgs/mdi.svg'));
    // matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('../../assets/fonts/materialdesignicons-webfont.woff'));
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        UtenteService,
        PagamentoService,
        ContoService,
        UtentiStore,
        ContiStore,
        httpInterceptorProviders,
      ],
    };
  }
}
