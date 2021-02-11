import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Utente } from 'src/app/core/models/utente.model';
import { UtenteService } from 'src/app/core/services/utente.service';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit, OnDestroy {

  /** standard accettati dal lettore */
  readonly allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13];
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;

  /**
   * scanner.
   * documentazione: https://github.com/zxing-js/ngx-scanner/wiki/Advanced-Usage
   */
  @ViewChild(ZXingScannerComponent)
  scanner: ZXingScannerComponent;

  @Output() clientAuthEvent = new EventEmitter<Utente>();

  /** determina se è riuscito ad aprire o meno lo scanner */
  statusScanner$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private subscriptions: Subscription[] = [];

  constructor(private utenteService: UtenteService) { }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /** alla lettura dello stato prova ad effettuare il login */
  scanSuccessHandler(token: string) {
    this.scanner.enable = false;
    this.subscriptions.push(
      this.utenteService.getUtenteByTokenOtp(token).subscribe(
        cliente => this.clientAuthEvent.emit(cliente),
        error => this.scanner.enable = true
      )
    );
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;

    if (this.availableDevices && this.availableDevices.length > 0) {
      this.currentDevice = this.availableDevices[0];
    }
  }

  selectDevice(change: MatSelectChange) {
    this.currentDevice = this.availableDevices.find(dev => dev.deviceId === change.value) || null;
  }

  /** modifica lo stato del reader, che indica se è in funzione o ha dei problemi in esecuzione */
  readerStatus(status: boolean) {
    this.statusScanner$.next(status);
  }
}
