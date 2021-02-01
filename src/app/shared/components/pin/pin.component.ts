import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtenteType } from 'src/app/core/constants/utente-type.enum';
import { PagamentoService } from 'src/app/core/services/pagamento.service';
import { UtenteService } from 'src/app/core/services/utente.service';
import { UtentiStore } from 'src/app/core/stores/utenti.store';

import { numericValidator } from '../../directives/numeric.directive';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss']
})
export class PinComponent implements OnInit, OnDestroy {
  /** controller del form */
  formCrl: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private utenteService: UtenteService,
    private utentiStore: UtentiStore,
    private pagamentoService: PagamentoService,
  ) {
    this.formCrl = this.fb.group({
      userId: this.fb.control('', [Validators.required]),
      pinCode: this.fb.control('', [Validators.required, numericValidator(), Validators.minLength(4), Validators.maxLength(4)])
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach(subsc => subsc.unsubscribe());
  }

  login() {
    this.subscriptions.push(
      this.utenteService.getUtenteByPin(this.formCrl.value.userId, this.formCrl.value.pinCode).pipe(
        map(cliente => this.utentiStore.add(UtenteType.cliente, cliente)),
      ).subscribe({
        next: () => this.pagamentoService.handlePagamento(),
        error: (err) => {
          // TODO: differenziare dal semplice errore del login per riproporre la schermata
          console.error(err);
          this.formCrl.controls.userId.setErrors({ WrongBE: true });
          this.formCrl.controls.pinCode.setErrors({ WrongBE: true });
          // const titleLabel = 'Impossibile effettuare il login';
          // this.router.navigateByUrl(`/error?titleLabel=${titleLabel}&content=${err.message}&error=${JSON.stringify(err)}`);
        }
      }));
  }
}