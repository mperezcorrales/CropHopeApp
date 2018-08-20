import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  authenticated = false;

  constructor(private authService: AuthService) {
    this.authService.getUser().subscribe(user => {
      if (user) {
        console.log('1');
        this.authenticated = true;
      } else {
        console.log('2');
        this.authenticated = false;
      }
    });
  }

}
