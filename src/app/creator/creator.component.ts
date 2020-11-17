import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Registros, IHash } from '../models/registros.model';
import { RegistrosService } from '../services/registros.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AuthService } from '../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss'],
  providers: [RegistrosService, DatePipe, AuthService],
})
export class CreatorComponent implements OnInit {
  user_code = '';
  index = 0;
  tests = [];
  tests_add = [];
  pos_add = [];
  creatorForm = new FormGroup({
    id: new FormControl(''),
    control_code: new FormControl(''),
    coment: new FormControl(''),
  });
  test_res: IHash = {};
  constructor(
    private rgSvc: RegistrosService,
    private router: Router,
    private datepipe: DatePipe,
    private authSv: AuthService
  ) {}

  ngOnInit(): void {}
  async init_vars() {
    await this.authSv.get_user_code().then((res) => {
      this.user_code = res;
    });
    this.tests = await this.rgSvc.getTests(this.user_code);
  }
  async onSubmit() {
    let date = new Date();
    let courrentDate = this.datepipe.transform(date, 'dd-MM-yyyy hh:mm');
    let nombre_usuario: string;
    await this.authSv.get_user_name().then((res) => {
      nombre_usuario = res;
    });
    const { id, control_code, coment } = this.creatorForm.value;
    const data: Registros = {
      id: id,
      test_date: courrentDate,
      control_code: control_code,
      id_grupo: this.user_code,
      coments: coment,
      operador: nombre_usuario,
      test: this.test_res,
      leido: "false",
    };
    if (data.id && data.control_code) {
      let iscc = await this.rgSvc.is_control_code(data.control_code,data.id_grupo);
      let isid = await this.rgSvc.is_id(data.id,data.id_grupo);
      if (iscc == true && isid == true) {
        Swal.fire('Oops...', 'Codigo de Control  y id ya registrados', 'error');
      } else if (iscc == true) {
        Swal.fire('Oops...', 'Codigo de Control ya registrado', 'error');
      } else if (isid == true) {
        Swal.fire('Oops...', 'Id ya registrado', 'error');
      } else if(this.tests_add.length == 0) {
        Swal.fire('Oops...', 'Introduce al menos un test ','error');
      }
      else {
        this.rgSvc
          .createRegistro(data)
          .then(() => {
            this.show_ok_banner();
            this.deleteForm();
          })
          .catch(() => {
            this.show_not_ok_banner();
          });
      }
    } else {
      Swal.fire(
        'Oops...',
        'Id  de paciente o Codigo de control no introducido',
        'error'
      );
    }
  }
  async deleteForm() {
    this.tests =  await this.rgSvc.getTests(this.user_code);
    this.test_res =  {};

    this.tests_add = [];
    this.pos_add = [];
    this.creatorForm = new FormGroup({
      id: new FormControl(''),
      control_code: new FormControl(''),
      coment: new FormControl(''),
    });
  }
  show_ok_banner() {
    Swal.fire({
      text: 'Informe Registrado!',
      icon: 'success',
    });
  }
  show_not_ok_banner() {
    Swal.fire('Oops...', 'Something went wrong!', 'error');
  }
  log_out() {
    this.authSv.logout();
    this.router.navigate(['../']);
  }
  async show_test_options() {
    if (this.user_code == '') {
      await this.init_vars();
    }

    const { value: tipo } = await Swal.fire({
      title: 'Select test',
      input: 'radio',
      inputOptions: this.tests,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Seleccecion una opcion';
        }
      },
    });
    if (tipo) {
      const { value: res } = await Swal.fire({
        title: 'Test result',
        input: 'radio',
        inputOptions: ['Negative', 'Positive'],
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Seleccecion una opcion';
          }
        },
      });
      if (res) {
        this.create_result(tipo, res);
      }
    }
  }
  create_result(tipo, res) {
    console.log('reeeees111', this.test_res);
    this.test_res[this.tests[tipo]] = res == 1 ? 'POS' : 'NEG';
    console.log('reeeees', this.test_res);
    this.tests_add.push(this.tests[tipo]);
    this.pos_add.push(String(res));
    delete this.tests[tipo];
  }
  remove_test(tipo,i)
  {
    this.tests_add.splice(i,1);
    this.pos_add.splice(i,1);
    this.tests.push(tipo);
    this.test_res[tipo] = null;
  }
}
