import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup = new FormGroup({
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    username: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    staySignedIn: new FormControl()
  })

  public error: String
  public loading: boolean = false

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true
    const user = new User()
    user.firstName = this.signupForm.value['firstName']
    user.lastName = this.signupForm.value['lastName']
    user.username = this.signupForm.value['username']
    user.email = this.signupForm.value['email']
    user.password = this.signupForm.value['password']
    const staySignedIn = this.signupForm.value['staySignedIn']
    this.authService.signup(user, staySignedIn)
      .subscribe(() => {
        this.loading = false
        this.router.navigate(['/chats'])
      }, (err: HttpErrorResponse) => {
        this.loading = false
        switch (err.status) {
          case 400:
            this.error = 'Email not available'
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
