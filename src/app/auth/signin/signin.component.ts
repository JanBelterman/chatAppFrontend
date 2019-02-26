import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  signinForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    staySignedIn: new FormControl()
  })

  error: String
  loading: boolean = false

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {
    this.loading = true
    const login = new Login(
      this.signinForm.value['email'],
      this.signinForm.value['password']
    )
    const staySignedIn = this.signinForm.value['staySignedIn']

    this.authService.signin(login, staySignedIn)
      .subscribe(() => {
        this.loading = false
        this.router.navigate(['/chats'])
      }, (err: HttpErrorResponse) => {
        this.loading = false
        switch (err.status) {
          case 400:
            this.error = 'Invalid credentials'
            break;
          default:
            this.error = 'Something failed'
        }
      })
  }

  close() {
    this.error = null
  }

}
