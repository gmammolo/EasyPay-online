import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { concatMap, debounceTime, switchMap } from 'rxjs/operators';
import { UtenteType } from 'src/app/core/constants/utente-type.enum';
import { CustomError, CUSTOM_ERROR } from 'src/app/core/models/error.model';
import { Utente } from 'src/app/core/models/utente.model';
import { ContoService } from 'src/app/core/services/conto.service';
import { LoaderService, LoadingStatus } from 'src/app/core/services/loader.service';
import { PagamentoService } from 'src/app/core/services/pagamento.service';
import { UtenteService } from 'src/app/core/services/utente.service';
import { ContiStore } from 'src/app/core/stores/conti.store';
import { UtentiStore } from 'src/app/core/stores/utenti.store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  readonly LoadingStatus =  LoadingStatus;

  /** dati sull' errore ottenuto cercando di recuperare le informazioni */
  error$: BehaviorSubject<CustomError> = new BehaviorSubject(undefined);

  statusLoader$: BehaviorSubject<LoadingStatus>;

  prezzo$: BehaviorSubject<number>;

  commerciante$: BehaviorSubject<Utente>;


  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private utenteService: UtenteService,
    private pagamentoService: PagamentoService,
    private loaderService: LoaderService,
    private contoService: ContoService,
    private utentiStore: UtentiStore,
    private contiStore: ContiStore,
  ) {
    this.statusLoader$ = this.loaderService.status$;
  }

  /*
   * idConto: id del commerciante
   * prezzo: prezzo da pagare
   */
  ngOnInit() {
    this.commerciante$ = new BehaviorSubject(this.utentiStore.get(UtenteType.commerciante));
    this.prezzo$ = this.pagamentoService.prezzo$;

    this.subscriptions.push(this.route.queryParams
      .pipe(
        // debounceTime evita l'emit iniziale prima che i param siano effettivamente inizializzati
        debounceTime(200),
        switchMap(params => {
          localStorage.setItem('onlineToken', params.token);
          this.pagamentoService.setPrezzo(params.prezzo);
          if (this.commerciante$.value && this.commerciante$.value.id) {
            return this.commerciante$;
          } else {
            return this.contoService.getConto(params.idConto).pipe(
              concatMap(conto => {
                this.contiStore.add(UtenteType.commerciante, conto);
                return this.utenteService.getUtenteNoSecurity(conto.id);
              })
            );
          }
        })
      )
      .subscribe({
        next:  result => {
          if (result.type === UtenteType.commerciante) {
            this.utentiStore.add(UtenteType.commerciante, result);
            this.commerciante$.next(result);
            this.loaderService.changeStatus(LoadingStatus.SUCCESS);
          } else {
            // account cliente
            const error = {
              type: CUSTOM_ERROR,
              name: 'tipo account errato',
              message: 'è necessario un account da commerciante, ma questo account è di tipo ' + result.type,
            };
            this.error$.next(error);
            this.loaderService.changeStatus(LoadingStatus.FAILED);
            throw error;
          }
        },
        error: error => {
          this.error$.next(error);
          this.loaderService.changeStatus(LoadingStatus.FAILED);
        },
      }));
  }


  ngOnDestroy() {
    this.subscriptions.forEach(subsc => subsc.unsubscribe());
  }
}
