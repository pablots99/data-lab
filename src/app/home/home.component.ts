import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms'
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [AuthService]
})
export class HomeComponent implements OnInit {

  loginForm= new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })
  constructor(private authSvc: AuthService) { }

  ngOnInit(): void {
  }

  async onLogin() {
    const{email, password} = this.loginForm.value;
    this.authSvc.login(email, password);
    const user = await this.authSvc.getCurrentUser();
    if(user){
      console.log("User->",user);
    }
    else
    {
      console.log("error");
    }
  }
}
