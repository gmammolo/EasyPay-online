import { Component, OnInit, ViewChild } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BehaviorSubject } from 'rxjs';
import { CUSTOM_ERROR } from 'src/app/core/models/error.model';
import { PagamentoService } from 'src/app/core/services/pagamento.service';
import { UtenteService } from 'src/app/core/services/utente.service';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {

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

  constructor(private utenteService: UtenteService, private pagamentoService: PagamentoService) { }

  ngOnInit() { }

  /** alla lettura dello stato prova ad effettuare il login */
  scanSuccessHandler(token: string) {
    this.scanner.enable = false;
    this.utenteService.getUtenteByTokenOtp(token).subscribe(result => {
      if (result.type !== CUSTOM_ERROR) {
        this.pagamentoService.handlePagamento();
      } else {
        this.scanner.enable = true;
      }

    });
  }

  /** modifica lo stato del reader, che indica se è in funzione o ha dei problemi in esecuzione */
  readerStatus(status: boolean) {
    this.statusScanner$.next(status);
  }
}
