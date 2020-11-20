import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { Registros } from 'src/app/models/registros.model';
import { last, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RegistrosService {
  constructor(private firestore: AngularFirestore) {}
  last:QueryDocumentSnapshot<DocumentData>;

  async getRegistros(id_grupo,cond,leido) {
    this.firestore.collection('/registros', (ref) =>
      ref.where('id_grupo', '==', id_grupo)
    );
    const query = this.firestore.collection('/registros', (ref) =>
    ref.where('leido', '==', leido).orderBy(cond).startAfter((this.last)?this.last:0).limit(20)
  );
    return query
      .get()
      .toPromise()
      .then((res) => {
         this.last = res.docs[res.docs.length-1];
        return res;
      });
  }
  createRegistro(registro: Registros) {
    return this.firestore.collection('registros').add(registro);
  }
  async updateRegistro(registro: Registros) {
    let res;
    const query = this.firestore.collection('/registros', (ref) =>
      ref.where('id', '==', registro.id)
    );
    await query
      .get()
      .toPromise()
      .then((p) => {
        p.forEach((l) => {
          if (l.exists && l.data().id == registro.id) res = l.id;
        });
      });
    this.firestore.collection('registros').doc(res).update({leido: registro.leido})
  }
  deleteRegistro(registroId: string) {
    this.firestore.doc('registros/' + registroId).delete();
  }
  async is_name(nombre){
    let cond: boolean = false;

    const query = this.firestore.collection('/registros', (ref) =>
      ref.where('nombre', '==', nombre)
    );
    await query
    .get()
    .toPromise()
    .then((res) => {
      res.forEach((a) => {
        if (a.exists) cond = true;
      });
    });
  return cond;

  }
  async is_id(id, grupo) {
    let cond: boolean = false;
    const query = this.firestore.collection('/registros', (ref) =>
      ref.where('id', '==', id)
    );
    await query
      .get()
      .toPromise()
      .then((res) => {
        res.forEach((a) => {
          if (a.exists && a.data().id_grupo == grupo) cond = true;
        });
      });
    return cond;
  }
  async is_control_code(control_code, grupo) {
    let cond: boolean = false;
    const query = this.firestore.collection('/registros', (ref) =>
      ref.where('control_code', '==', control_code)
    );
    await query
      .get()
      .toPromise()
      .then((res) => {
        res.forEach((a) => {
          if (a.exists && a.data().id_grupo == grupo) cond = true;
        });
      });
    return cond;
  }
  async getTests(codigo) {
    let tests = [];
    await this.firestore
      .doc('grupos/' + codigo)
      .get()
      .toPromise()
      .then((doc) => {
        if (doc.exists) {
          var data = doc.data();
          tests = data.tests;
        } else {
          console.log('grupos fail');
        }
      })
      .catch((error) => {
        console.log('getText Errors');
      });
    return tests;
  }
}
