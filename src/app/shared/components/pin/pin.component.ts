import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PagamentoService } from 'src/app/core/services/pagamento.service';
import { UtenteService } from 'src/app/core/services/utente.service';

import { numericValidator } from '../../directives/numeric.directive';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss']
})
export class PinComponent implements OnInit {
  /** controller del form */
  formCrl: FormGroup;

  constructor(
    private fb: FormBuilder,
    private utenteService: UtenteService,
    private pagamentoService: PagamentoService,
    private router: Router,
  ) {
    this.formCrl = this.fb.group({
      userId: this.fb.control('', [Validators.required]),
      pinCode: this.fb.control('', [Validators.required, numericValidator(), Validators.minLength(4), Validators.maxLength(4)])
    });
  }

  ngOnInit() {}

  login() {
    this.utenteService.getUtenteByPin(this.formCrl.value.userId, this.formCrl.value.pinCode).subscribe({
      next: () => this.pagamentoService.handlePagamento(),
      error: (err) => {
        // TODO: differenziare dal semplice errore del login per riproporre la schermata
        console.error(err);
        this.formCrl.controls.userId.setErrors({ WrongBE: true });
        this.formCrl.controls.pinCode.setErrors({ WrongBE: true });
        // const titleLabel = 'Impossibile effettuare il login';
        // this.router.navigateByUrl(`/error?titleLabel=${titleLabel}&content=${err.message}&error=${JSON.stringify(err)}`);
      }
    });
  }
}