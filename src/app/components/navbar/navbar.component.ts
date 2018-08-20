import { User } from './../../models/user';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() authenticated: boolean;

  loggedUser: User = {
    uid: '',
    email: '',
    finishedForm: false,
    entityName: '',
    description: '',
    isAgricultureCompany: false,
    ethereumId: ''
  };

  navbarOpen = false;

  constructor(private authService: AuthService) {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.loggedUser = user;
      }
    });
  }

  ngOnInit() {
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  onSignOut() {
    console.log('sign out');
    this.authService.logout();
  }

}
