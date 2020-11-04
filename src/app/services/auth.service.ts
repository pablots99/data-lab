import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase-tools';
import { user } from 'firebase-tools';
import { first } from 'rxjs/operators';
@Injectable()
export class AuthService {

  constructor(public afAuth: AngularFireAuth) { }

  async login(email:string, password:string)
  {
    try
    {
      const result = await this.afAuth.signInWithEmailAndPassword(email,password);
      return result;
    }
    catch(error)
    {
      console.log(error);
    }
  }
  async logout()
  {
    await this.afAuth.signOut();
  }
  getCurrentUser(){
    return this.afAuth.currentUser
  }
}
