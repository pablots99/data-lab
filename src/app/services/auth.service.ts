import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { stringify } from 'querystring';
import { UserInterface } from '../models/user.model';

@Injectable()
export class AuthService {
  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {}

  async login(email: string, password: string) {
    const result = await this.afAuth.signInWithEmailAndPassword(
      email,
      password
    );
    return result;
  }

  async logout() {
    await this.afAuth.signOut();
  }

  async getCurrentUser() {
    return await this.afAuth.currentUser;
  }
  registerUser(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afAuth
        .createUserWithEmailAndPassword(email, pass)
        .then((userData) => {
          resolve(userData);
        })
        .catch((err) => reject(err));
    });
  }
  updateUserData(user: UserInterface) {

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.id}`
    );
    return userRef.set(user, { merge: true });
  }
  async is_valid_code(code) {
    const groupRef: AngularFirestoreDocument<any> = this.afs.doc(
      `grupos/${code}`
    );
    let cond: boolean = false;
    await groupRef
      .get()
      .toPromise()
      .then((doc) => {
        if (doc.exists) {
          cond = true;
        }
      });
    return cond;
  }

  async get_user_name(){
    const user = await this.getCurrentUser();
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    let name:string = "";

    await userRef
      .get()
      .toPromise()
      .then(function (doc) {
        if (doc.exists) {
          var data = doc.data();
          name = data.nombre
        } else {
          console.log('');
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
      return name;
  }
  async get_user_code(){
    const user = await this.getCurrentUser();
    const userRef: AngularFirestoreDocument<any> =  this.afs.doc(
      `users/${user.uid}`
    );
    let name:string = "";

    await userRef
      .get()
      .toPromise()
      .then(function (doc) {
        if (doc.exists) {
          var data = doc.data();
          name = data.code
        } else {
          console.log('error user code');
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
      return name;
  }

  async isUserAdmin(userUid) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${userUid}`
    );
    let cond: boolean = false;

    await userRef
      .get()
      .toPromise()
      .then(function (doc) {
        if (doc.exists) {
          var data = doc.data();
          if (data.admin == true) {
            cond = true;
          }
        } else {
          //doc.data() will be undefined in this case
          console.log('No such document!');
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
    return cond;
  }
}
