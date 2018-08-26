import { FundraiserProfileService } from './../../services/fundraiser-profile.service';
import { FundraiserProfile } from './../../models/fundraiserProfile';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: User;
  userLoaded = false;
  showPublicProfileForm = false;
  publicProfile = new FundraiserProfile();
  publicProfileFile: File;

  constructor(private authService: AuthService, private router: Router,
    private fundraiserProfileService: FundraiserProfileService) {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.userLoaded = true;
        console.log(this.user);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {
  }

  onPublicProfileSubmit() {
    console.log(this.showPublicProfileForm);
    if (this.publicProfile.allParamsAreFilled() && this.publicProfileFile) {
      this.fundraiserProfileService.addPublicProfile(this.user.uid, this.publicProfile, this.publicProfileFile);
      this.showPublicProfileForm = false;
    } else {
      alert('You won\'t be able to save your public profile unless you fill all the parameters.');
    }
  }

  onPublicProfileFormCancel() {
    this.showPublicProfileForm = false;
    this.publicProfile.clear();
  }

  onPublicProfileLogoUploaded($event) {
    const e = event as any;
    this.publicProfileFile = e.target.files[0];
  }

}
