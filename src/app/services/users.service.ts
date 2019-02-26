import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Participant } from '../models/participant';
import { environment } from 'src/environments/environment';
import { filter, concatAll } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  fetchUsers() {
    return this.httpClient.get<Participant[]>(`${environment.apiUrl}/users`, {
      headers: new HttpHeaders({
        'x-auth-token': this.authService.token.toString()
      })
    }).pipe(
      concatAll(),
      // Filter current user from list
      filter((user: Participant) => {
        return user._id !== this.authService.userId
      })
    )
  }

}