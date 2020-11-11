import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Registros } from 'src/app/models/registros.model';

@Injectable({
  providedIn: 'root',
})
export class RegistrosService {
  constructor(private firestore: AngularFirestore) {}

  getRegistros() {
    return this.firestore.collection('registros').snapshotChanges();
  }
  createRegistro(registro: Registros) {
    return this.firestore.collection('registros').add(registro);
  }
  updateRegistro(registro: Registros) {
    delete registro.id;
    this.firestore.doc('registros/' + registro.id).update(registro);
  }
  deleteRegistro(registroId: string) {
    this.firestore.doc('registros/' + registroId).delete();
  }
}
