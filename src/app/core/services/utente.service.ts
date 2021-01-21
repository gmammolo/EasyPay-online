import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  CUSTOM_ERROR,
  WrongParamError,
} from '../models/error.model';
import { Utente } from '../models/utente.model';
import { ApiUtente } from '../models/api-utente.model';
import { UtenteType } from '../constants/utente-type.enum';

@Injectable({
  providedIn: 'root',
})
export class UtenteService {

  readonly emptyUtente = {
    type: UtenteType.cliente,
    id: '',
    otp: '',
    nome: '',
    cognome: '',
    email: '',
    createdAt: undefined,
    updatedAt: undefined,
    address: '',
    birthDate: '',
    phone: '',
    idConto: '',
  };

  constructor(private http: HttpClient) {
  }

  getUtenteByPin(id: string, pin: string): Observable<Utente> {
    if (!id || !pin) {
      return throwError(new WrongParamError({ id, pin }));
    }

    return this._getClient(id, { pin });
  }

  getUtenteByTokenOtp(qrCode: string): Observable<Utente> {
    const [id, otp] = qrCode.split('-');
    if (!id || !otp) {
      return throwError(new WrongParamError({ id, otp }));
    }

    return this._getClient(id, { otp });
  }

  getSelfClient(): Observable<Utente> {
    return this.http.get<ApiUtente>(`/api/clienti/self`).pipe(
      map(apiUtente => this._cleanUtente(apiUtente))
    );
  }


  /** effettua la richiesta HTTP per verificare se il login dell'utente va a buon fine */
  private _getClient(
    id: string,
    params: { pin?: string; otp?: string }
  ): Observable<Utente> {
    return this.http
      .get<ApiUtente>(`/api/clienti/${id}`, { params })
      .pipe(
        map(result => {
          if (result && result.id && (result.type === UtenteType.cliente || result.type === UtenteType.commerciante)) {
            return result;
          } else {
            throw {
              type: CUSTOM_ERROR,
              name: 'account not found',
              message: `non è stato possibile trovare l'account`,
            };
          }
        }),
        map((apiUtente) => this._cleanUtente(apiUtente)),
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


  /** riceve in input un apiUtente e modifica i parametri diversi in modo da ottenere un oggetto utente */
  private _cleanUtente(apiUtente: ApiUtente): Utente {
    return ({
      type: UtenteType.cliente,
      ...apiUtente,
      id: apiUtente.id + '',
      idConto: apiUtente.id_conto + '',
      birthDate: apiUtente.birth_date,
    } as Utente);
  }
}
