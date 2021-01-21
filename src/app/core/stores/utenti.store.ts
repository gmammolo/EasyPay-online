import { Injectable } from '@angular/core';
import { UtenteType } from '../constants/utente-type.enum';
import { Utente } from '../models/utente.model';

/**
 * Salva nello store i dati del commerciante e i dati del cliente.
 * Trick: il Cliente potrebbe essere un commerciante, ma all'interno dello store si usa UtenteType.cliente
 */
@Injectable({
  providedIn: 'root'
})
export class UtentiStore {

  private store: {[UtenteType: string]: Utente} = {};

  constructor() { }

  public get(utenteType: UtenteType) {
    if (this.store[utenteType]) {
      return this.store[utenteType];
    }
  }

  public add(utenteType: UtenteType, cliente: Utente) {
    this.store[utenteType] = cliente;
  }
}
