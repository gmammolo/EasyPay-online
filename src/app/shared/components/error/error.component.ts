import { Component, OnInit, Input } from '@angular/core';
import { CustomError } from 'src/app/core/models/error.model';
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  /** titolo della pagina di errore */
  @Input() titleLabel: string;

  /** contenuto html del messaggio di errore */
  @Input() content: string;

  /** oggetto errore da stampare se presente */
  @Input() error: CustomError;

  constructor() { }

  ngOnInit() {
  }

  getFormattedError(): string {
    let message = this.error?.message;
    try {
      message = JSON.parse(message);
    } catch (err) { /* nessun problema: message può essere una stringa */}
    if (typeof message === 'string') {
      return message;
    }
    if ( typeof message === 'object') {
      const unknowError = message as any;
      if (typeof unknowError.message === 'string') {
        return unknowError.message;
      }
      return JSON.stringify(unknowError);
    }
    return '';
  }


}
