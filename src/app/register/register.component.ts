import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { UserInterface } from '../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [AuthService],
})
export class RegisterComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    code: new FormControl(''),
    name: new FormControl(''),

  });
  constructor(private authSvc: AuthService, private router: Router) {}

  ngOnInit(): void {}
  loadLogin() {
    this.router.navigate(['../']);
  }
  async onRegister() {
    const { email, password, code ,name } = this.loginForm.value;
    if (!email || !password || !code || !name) {
      Swal.fire('Oops...', 'Rellene todos los campos', 'error');
    } else {
      if ((await this.authSvc.is_valid_code(code)) == true) {
        await this.authSvc.registerUser(email, password).catch((er) => {
          Swal.fire('Oops...', er.message, 'error');
          return ;
        });
        await this.authSvc.login(email, password).catch(() => {
          return;
        });
      const user = await this.authSvc.getCurrentUser();
        const data: UserInterface = {
          id: user.uid,
          email: user.email,
          admin: false,
          nombre: name,
          code: code,
        };
        await this.authSvc.updateUserData(data).then(()=> this.router.navigate(["../creator"]))
      } else {
        Swal.fire('Oops...', 'Codigo incorrecto', 'error');
      }
    }
  }
}
