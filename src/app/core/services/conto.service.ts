import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiConto } from '../models/api-conto.model';
import { Conto } from '../models/conto.model';
import { CustomError, CUSTOM_ERROR, WrongParamError } from '../models/error.model';

@Injectable({
  providedIn: 'root'
})
export class ContoService {

  readonly emptyConto: Conto = {
    id: '',
    budget: 0,
    saldo: 0,
    availableBudget: 0,
    idCliente: '',
  };

  constructor(private http: HttpClient) { }


  getConto(idConto: string): Observable<Conto> {
    if (!idConto) {
      return throwError(new WrongParamError(idConto));
    }
    return this._getContoRequest(`/api/conti/${idConto}`);
  }

  getSelfConto(): Observable<Conto> {
    return this._getContoRequest('/api/conti}/self');
  }


  private _getContoRequest(url: string) {
    return this.http.get<ApiConto>(url).pipe(
      map(result => {
        if (result && result.id) {
          return result;
        } else {
          throw { type: CUSTOM_ERROR, name: 'account not found', message: `non è stato possibile trovare l'account` };
        }
      }),
      map(apiConto => ({...apiConto, id: apiConto.id + '', idCliente: apiConto.id_cliente + '' } as Conto)),
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


  /** ripulisce e restituisce il Conto ben formattato */
  private clearConto(apiConto: ApiConto): Conto {
    return {...apiConto, id: apiConto.id + '', idCliente: apiConto.id_cliente + '' };
  }

}
