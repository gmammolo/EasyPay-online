import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CUSTOM_ERROR } from 'src/app/core/models/error.model';
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
  ) {
    this.formCrl = this.fb.group({
      userId: this.fb.control('', [Validators.required]),
      pinCode: this.fb.control('', [Validators.required, numericValidator(), Validators.minLength(4), Validators.maxLength(4)])
    });
  }

  ngOnInit() {}

  login() {
    this.utenteService.getUtenteByPin(this.formCrl.value.userId, this.formCrl.value.pinCode).subscribe(result => {
      if (result.type !== CUSTOM_ERROR) {
        this.pagamentoService.handlePagamento();
      }
    });
  }
}
