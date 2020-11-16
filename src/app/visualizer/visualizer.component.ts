import { Component, OnInit } from '@angular/core';
import { Registros, IHash } from '../models/registros.model';
import { AuthService } from '../services/auth.service';
import { RegistrosService } from '../services/registros.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss'],
  providers: [RegistrosService,AuthService],


})
export class VisualizerComponent implements OnInit {
   data: Registros[] = [];
   ids = []
   tests = []
  constructor(
    private rgSvc: RegistrosService,
    private auSvc: AuthService,
    private router: Router,

    ) { }

  ngOnInit(): void {

  }
 async get_data()
  {
      let code =  await this.auSvc.get_user_code();
      this.tests = await this.rgSvc.getTests(code);


       const res  =  await this.rgSvc.getRegistros(code).then((res)=>{
            const aa = res
            return res;
           })
        res.forEach(dat=>{
           let reg =  new Registros;
           this.ids.push(dat.id)
           reg.id = dat.data().id;
            reg.id_grupo = dat.data().id_grupo;
            reg.coments = dat.data().coments;
            reg.test_date = dat.data().test_date;
            reg.control_code =  dat.data().control_code;
            reg.operador =  dat.data().operador;
            reg.test =  dat.data().test;
            this.data.push(reg)
          //console.log(dat.data().id)
        })
          this.data.forEach(dat=>{
           console.log(dat)
          })
  }
  log_out() {
    this.auSvc.logout();
    this.router.navigate(['../']);
  }

  //algo esta mal aqui
  delete_register(id,i){
    this.rgSvc.deleteRegistro(id)
    var indice = this.data.indexOf(i); // obtenemos el indice
    this.data.splice(indice, 1)
    var indice = this.ids.indexOf(i); // obtenemos el indice
    this.ids.splice(indice, 1)
  }
}
