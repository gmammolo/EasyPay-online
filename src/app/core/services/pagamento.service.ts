import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { UtenteType } from '../constants/utente-type.enum';
import { CUSTOM_ERROR, CustomError } from '../models/error.model';
import { UtentiStore } from '../stores/utenti.store';

@Injectable({
  providedIn: 'root'
})
export class PrezzoService {
  prezzo$: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private http: HttpClient,
    private clientiStore: UtentiStore,
    private router: Router
  ) {}
  /** Salva il valore del trasferimento da effettuare */
  setPrezzo(value: string) {
    const convPrezzo = Number.parseFloat(value);
    if (!isNaN(convPrezzo)) {
      this.prezzo$.next(Number.parseFloat(value));
    } else {
      throw { type: CUSTOM_ERROR, name: 'errore sul prezzo', message: 'deve essere un valore numerico' };
    }
  }

  /** gestisce un pagamento una volta che gli store sono stati tutti inizializzati correttamente */
  handlePagamento() {
    this.pagamento(
      this.clientiStore.get(UtenteType.cliente) ? this.clientiStore.get(UtenteType.cliente).idConto : '',
      this.clientiStore.get(UtenteType.commerciante) ? this.clientiStore.get(UtenteType.commerciante).idConto : '',
      this.prezzo$.value // TODO: vedere che fare del prezzo
    ).subscribe({
      next: result => {
        const response = { timestamp: new Date().getTime() };
        if (window.opener) {
          window.opener.postMessage(JSON.stringify({ success: true, ...response }), '*');
          setInterval(() => window.close(), 1000);
        } else {
          console.error('Impossibile chiudere pagina');
        }
      },
      error: (error: CustomError) => {
        const titleLabel = 'Impossibile procedere con il pagamento';
        window.opener.postMessage(
          JSON.stringify({ success: false, erroCode: error.name, errorMessage: error.message }),
          '*'
        );
        setInterval(() => window.close(), 1000);
        this.router.navigateByUrl(`/error?titleLabel=${titleLabel}&content=${error.message}&error=${JSON.stringify(error)}`);
      }
    });
  }

  pagamento(idContoCliente: string, idContoCommerciante: string, prezzo: number): Observable<boolean> {
    const params = {
      from: idContoCliente,
      to: idContoCommerciante,
      value: prezzo + '',
    };
    return this.http.post('api/pagamenti', params).pipe(
      map(result => {
        console.error('TODO: gestire la risposta del pagamento');
        return true;
        // TODO: caso di saldo mancante:
        // const message = 'Ricaricare il conto';
        // throw { type: CUSTOM_ERROR, name: 'Saldo Insufficiente', message } as CustomError;
      }),
      catchError((error) => {
        console.error('error');
        throw {
          type: CUSTOM_ERROR,
          name: 'backend error',
          message: error,
        };
      })
    );
  }
}
