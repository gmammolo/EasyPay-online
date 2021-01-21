import { Injectable } from '@angular/core';
import { UtenteType } from '../constants/utente-type.enum';
import { Conto } from '../models/conto.model';

@Injectable({
  providedIn: 'root'
})
export class ContiStore {

  private store: {[UtenteType: string]: Conto} = {};

  constructor() { }

  public get(id: string): Conto;
  public get(utenteType: UtenteType, id: string = ''): Conto {
    if (utenteType === UtenteType.cliente || utenteType === UtenteType.commerciante) {
      return this.store[utenteType];
    } else if (id) {
      return this.store[Object.keys(this.store).find(key => this.store[key].id === id )];
    }
  }

  public add(utenteType: UtenteType, conto: Conto) {
    this.store[utenteType] = conto;
  }
}
