import { Component, OnInit } from '@angular/core';
import { Registros, IHash } from '../models/registros.model';
import { AuthService } from '../services/auth.service';
import { RegistrosService } from '../services/registros.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss'],
  providers: [RegistrosService, AuthService],
})
export class VisualizerComponent implements OnInit {
  code = ""
  public innerWidth: any;
  data: Registros[] = [];
  data_leido: Registros[] = [];
  data_noLeido: Registros[] = [];
  ids = [];
  tests = [];
  constructor(
    private rgSvc: RegistrosService,
    private auSvc: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    let cond;
     cond =  await this.auSvc.isUserAdmin((await this.auSvc.getCurrentUser()).uid)
     if(cond == false)
     {
       this.router.navigate(['creator'])
     }
     else
     {
      this.innerWidth = window.innerWidth * 0.8;

      await this.get_data();

      this.data = this.data_noLeido
     }
  }
  async get_data() {
    this.code = await this.auSvc.get_user_code()
    this.tests = await this.rgSvc.getTests(this.code);

    const res = await this.rgSvc.getRegistros(this.code).then((res) => {
      const aa = res;
      return res;
    });
    res.forEach((dat) => {
      let reg = new Registros();
      this.ids.push(dat.id);
      reg.id = dat.data().id;
      reg.id_grupo = dat.data().id_grupo;
      reg.coments = dat.data().coments;
      reg.test_date = dat.data().test_date;
      reg.control_code = dat.data().control_code;
      reg.operador = dat.data().operador;
      reg.test = dat.data().test;
      reg.leido = dat.data().leido;
      if(reg.leido == "false")
      {
        this.data_noLeido.push(reg);
      }
      else
      {
        this.data_leido.push(reg);
      }
      //console.log(dat.data().id)
    });
    let hash = {};
    this.data = this.data.filter(o => hash[o.id] ? false : hash[o.id] = true);
  }
  log_out() {
    this.auSvc.logout();
    this.router.navigate(['../']);
  }
  mark_as_read(a:Registros,i)
  {
    if(a.leido == "true"){
      console.log(a.leido)
      a.leido = "false"
      this.data_noLeido.unshift(a)
      this.data_leido.splice(i, 1);
      this.data = this.data_leido
    }
    else if(a.leido == "false"){
      a.leido = "true"
      this.data_leido.unshift(a)
      this.data_noLeido.splice(i, 1);
      this.data = this.data_noLeido
    }

    this.rgSvc.updateRegistro(a)
  }
  cambia_filtros(num){
    if(num == 1)
    {
      this.data = this.data_noLeido

    }
    else  if(num == 2)
    {
      this.data = this.data_leido
    }
  }
  //algo esta mal aqui
  delete_register(id, i) {
    this.rgSvc.deleteRegistro(id);
    this.data.splice(i, 1);
    this.ids.splice(i, 1);
  }
}
