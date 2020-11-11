import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { UserInterface } from '../models/user.model';

@Injectable()
export class AuthService {
  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {}

  async login(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async logout() {
    await this.afAuth.signOut();
  }

  getCurrentUser() {
    return this.afAuth.currentUser;
  }
  registerUser(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afAuth
        .createUserWithEmailAndPassword(email, pass)
        .then((userData) => {
          resolve(userData), this.updateUserData(userData.user);
        })
        .catch((err) => console.log(reject(err)));
    });
  }
 updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const data: UserInterface = {
      id: user.uid,
      email: user.email,
      admin: false
    };
    return userRef.set(data, { merge: true });
  }


async isUserAdmin(userUid) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${userUid}`
    );
    let cond:boolean = false;

   await userRef.get().toPromise().then(function(doc) {
      if (doc.exists) {
         var data =  doc.data();
         if(data.admin == true)
         {
            cond = true;
         }
      } else {
          //doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
    return cond;
  }
}
