import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtenteType } from 'src/app/core/constants/utente-type.enum';
import { PagamentoService } from 'src/app/core/services/pagamento.service';
import { UtenteService } from 'src/app/core/services/utente.service';
import { UtentiStore } from 'src/app/core/stores/utenti.store';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit, OnDestroy {

  /** standard accettati dal lettore */
  readonly allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13];

  /**
   * scanner.
   * documentazione: https://github.com/zxing-js/ngx-scanner/wiki/Advanced-Usage
   */
  @ViewChild(ZXingScannerComponent)
  scanner: ZXingScannerComponent;

  /** determina se è riuscito ad aprire o meno lo scanner */
  statusScanner$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private subscriptions: Subscription[] = [];

  constructor(private utenteService: UtenteService, private utentiStore: UtentiStore, private pagamentoService: PagamentoService) { }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscriptions.forEach(subsc => subsc.unsubscribe());
  }

  /** alla lettura dello stato prova ad effettuare il login */
  scanSuccessHandler(token: string) {
    this.scanner.enable = false;
    this.subscriptions.push(
      this.utenteService.getUtenteByTokenOtp(token).pipe(
        map(cliente => this.utentiStore.add(UtenteType.cliente, cliente)),
      ).subscribe({
        next: () =>  this.pagamentoService.handlePagamento(),
        error: () => this.scanner.enable = true,
      }));
  }

  /** modifica lo stato del reader, che indica se è in funzione o ha dei problemi in esecuzione */
  readerStatus(status: boolean) {
    this.statusScanner$.next(status);
  }
}
