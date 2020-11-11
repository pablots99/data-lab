import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [AuthService],
})
export class HomeComponent implements OnInit {
  loginError: boolean;
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(private authSvc: AuthService, private router: Router) {}
  public is_admin: any = null;
  ngOnInit(): void {}

  async onLogin() {
    const { email, password } = this.loginForm.value;
    this.authSvc.login(email, password);
    const user = await this.authSvc.getCurrentUser();
    if (user) {
      this.authSvc.updateUserData(user);
      if (await this.authSvc.isUserAdmin(user.uid) == true) {
        this.router.navigate(['../visualizer']);
      } else {
        this.router.navigate(['../creator']);
      }
      console.log('User->', user);
    } else {
      this.loginError = true;
    }
  }
  change_value(){
    if(this.loginError = true)
      this.loginError = false;
  }
}
