import { Component, OnInit } from '@angular/core';
import { faSignInAlt, faSignOutAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  faSignin = faSignInAlt
  faSignout = faSignOutAlt
  faSignup = faUserPlus

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  isAuth() {
    return this.authService.isAuth()
  }

  singout() {
    this.authService.signout()
    this.router.navigate(['/signin'])
  }

}
