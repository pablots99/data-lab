import { Component, OnInit } from '@angular/core';
import { Registros, IHash } from '../models/registros.model';
import { AuthService } from '../services/auth.service';
import { RegistrosService } from '../services/registros.service';
import { Router } from '@angular/router';
import { NgForOf } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss'],
  providers: [RegistrosService, AuthService],
})
export class VisualizerComponent implements OnInit {
  index = 1;
  code = '';
  hide_load= true;
  public innerWidth: any;
  data: Registros[] = [];
  data_leido: Registros[] = [];
  data_noLeido: Registros[] = [];
  ids = [];
 loader = document.querySelector('#loader')

  tests: string[];
  constructor(
    private rgSvc: RegistrosService,
    private auSvc: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    let cond;
    cond = await this.auSvc.isUserAdmin(
      (await this.auSvc.getCurrentUser()).uid
    );
    if (cond == false) {
      this.router.navigate(['creator']);
    } else {
      this.innerWidth = window.innerWidth * 0.8;
      await this.get_data("test_date","true",0);
      await this.get_data("test_date","false",1);
    }
  }
  async get_data(test,cond,cambia_filtros) {
    this.hide_load = false;
    this.code = await this.auSvc.get_user_code();
    this.tests = await this.rgSvc.getTests(this.code);
    const res = await this.rgSvc.getRegistros(this.code,test,cond).then((res) => {
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
      if (reg.leido == 'false') {
        this.data_noLeido.push(reg);
      } else {
        this.data_leido.push(reg);
      }

    });
    let hash = {};
    this.data_noLeido = this.data_noLeido.filter((o) =>
      hash[o.id] ? false : (hash[o.id] = true)
    );
     hash = {};
    this.data_leido = this.data_leido.filter((o) =>
      hash[o.id] ? false : (hash[o.id] = true)
    );
    if (cambia_filtros== 1) {
      this.data = this.data_noLeido;
    } else if (cambia_filtros == 2) {
      this.data = this.data_leido;
    }
    this.hide_load = true;
  }
  log_out() {
    this.auSvc.logout();
    this.router.navigate(['../']);
  }
  mark_as_read(a: Registros, i) {
    if (a.leido == 'true') {
      a.leido = 'false';
      this.data_noLeido.unshift(a);
      this.data_leido.splice(i, 1);
      this.data = this.data_leido;
    } else if (a.leido == 'false') {
      a.leido = 'true';
      this.data_leido.unshift(a);
      this.data_noLeido.splice(i, 1);
      this.data = this.data_noLeido;
    }
    this.rgSvc.updateRegistro(a);
  }
  async cambia_filtros(num) {
    this.index = num;
    if (num == 1) {
      this.data = this.data_noLeido;
    } else if (num == 2) {
      this.data = this.data_leido;
    }
  }
  //algo esta mal aqui
  delete_register(id, i) {
    this.rgSvc.deleteRegistro(id);
    this.data.splice(i, 1);
    this.ids.splice(i, 1);
  }
  async export() {
    Swal.fire({
      text: 'Exportar Datos',
      icon: 'question',
      showCancelButton: true,
    }).then(res=>{
      if(res.value == true)
      {
        let header = [
          'id',
          'control_code',
          'coments',
          'test_date',
          'test_date',
          'operador',
        ];
        this.tests.forEach((a) => {
          header.push(a);
        });
        this.downloadFile(this.data,"data", header);
      }
    });

  }
  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let cond = false;
    let row = 'Nº,';
    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = i + 1 + '';
      for (let index in headerList) {
        let head = headerList[index];
        this.tests.forEach((a) => {
          if (head == a) {
            line += ',' + array[i]["test"][a];
            cond = true;
          }
        });
        if(cond == false)
          line += ',' + array[i][head];
        else
          cond = false
      }
        str += line + '\r\n';

    }
    return str;
  }
  downloadFile(data, filename,header) {
    let csvData = this.ConvertToCSV(data, header);
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;',
    });
    let dwldLink = document.createElement('a');

    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf('Safari') != -1 &&
      navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
}
