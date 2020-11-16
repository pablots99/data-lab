import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [AuthService],
})
export class HomeComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(private authSvc: AuthService, private router: Router) {}
  public is_admin: any = null;
  ngOnInit(): void {}

  async onLogin() {
    const { email, password } = this.loginForm.value;
    if(!email || !password)
    {
      Swal.fire('Oops...',"Rellene todos los campos", 'error');

    }else
    {
        await this.authSvc.login(email, password).catch((er)=>{
          Swal.fire('Oops...', er.message, 'error');
        });
        const user = await this.authSvc.getCurrentUser();
        if (user) {
          if (await this.authSvc.isUserAdmin(user.uid) == true) {
            this.router.navigate(['../visualizer']);
          } else {
            this.router.navigate(['../creator']);
          }
          console.log('User->', user);
        }
      }
  }
  loadRegister()
  {
    this.router.navigate(['../register']);
  }

}
