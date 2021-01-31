import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';
import { LoaderService, LoadingStatus } from 'src/app/core/services/loader.service';
import { CustomError } from 'src/app/core/models/error.model';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit, OnDestroy {

  /** titolo della pagina di errore */
  titleLabel$: BehaviorSubject<string>;

  /** contenuto html del messaggio di errore */
  content$: BehaviorSubject<string>;

  /** oggetto errore da stampare se presente */
  error$: BehaviorSubject<CustomError>;

  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private loaderService: LoaderService) {
    this.titleLabel$ = new BehaviorSubject('Impossibile procedere con il pagamento. Se il problema persiste contattare il venditore');
    this.content$ = new BehaviorSubject('SUGGERIMENTO PER IL VENDITORE: assicurarsi che il idConto e prezzo siano validi');
    this.error$ = new BehaviorSubject(undefined);
    this.loaderService.status$.next(LoadingStatus.FAILED);
  }

  ngOnInit() {
    this.subscriptions.push(this.route.queryParams
    .pipe(
      // debounceTime evita l'emit iniziale prima che i param siano effettivamente inizializzati
      debounceTime(200),
      switchMap(params => {
        if ( params.titleLabel) {
          this.titleLabel$.next(params.titleLabel);
        }
        if ( params.content ) {
          this.content$.next(params.content);
        }
        if ( params.error ) {
          this.error$.next(JSON.parse(params.error));
        }
        return [];
      })
    )
    .subscribe());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subsc => subsc.unsubscribe());
  }
}
