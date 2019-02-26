import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators'
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: String
  userId: String

  constructor(
    private httpClient: HttpClient
  ) {
    this.token = localStorage.getItem('token')
    this.userId = localStorage.getItem('userId')
  }

  isAuth() {
    return this.token != null
  }

  signup(user: User, staySignedIn = false) {
    return this.httpClient.post(`${environment.apiUrl}/users`, user, { observe: 'body' }).pipe(
      tap((response: any) => {
        this.setAuth(response.token, response._id, staySignedIn)
      })
    )
  }

  signin(login: Login, staySignedIn = false) {
    return this.httpClient.post(`${environment.apiUrl}/auth`, login).pipe(
      tap((response: any) => {
        this.setAuth(response.token, response._id, staySignedIn)
      })
    )
  }

  private setAuth(token: String, userId: String, staySignedIn = false) {
    this.token = token
    this.userId = userId
    if (staySignedIn) {
      localStorage.setItem('token', token.toString())
      localStorage.setItem('userId', userId.toString())
    }
  }

  signout() {
    this.token = null
    this.userId = null
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
  }

}
