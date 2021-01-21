import { Injectable } from '@angular/core';
import { Conto } from '../models/conto.model';

@Injectable({
  providedIn: 'root'
})
export class ContiStore {

  private store: {[id: string]: Conto} = {};

  constructor() { }

  public get(id: string) {
    if (this.store[id]) {
      return this.store.id;
    }
  }

  public add(conto: Conto) {
    this.store[conto.id] = conto;
  }
}
