import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoaderService, LoadingStatus } from 'src/app/core/services/loader.service';

import { UtenteType } from '../constants/utente-type.enum';
import { CUSTOM_ERROR, CustomError } from '../models/error.model';
import { UtentiStore } from '../stores/utenti.store';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {
  prezzo$: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private http: HttpClient,
    private utentiStore: UtentiStore,
    private router: Router,
    private loaderService: LoaderService,
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
    this.loaderService.changeStatus(LoadingStatus.LOADING);
    this.pagamento(
      this.utentiStore.get(UtenteType.cliente) ? this.utentiStore.get(UtenteType.cliente).idConto : '',
      this.utentiStore.get(UtenteType.commerciante) ? this.utentiStore.get(UtenteType.commerciante).idConto : '',
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
        this.loaderService.changeStatus(LoadingStatus.SUCCESS);
      },
      error: (error: CustomError) => {
        this.loaderService.changeStatus(LoadingStatus.SUCCESS);
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
    return this.http.post('/api/pagamenti', params).pipe(
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
