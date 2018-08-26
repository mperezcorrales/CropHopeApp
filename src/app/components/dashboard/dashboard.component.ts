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
  publicProfile = new FundraiserProfile(null);
  publicProfileFile: File;

  constructor(private authService: AuthService, private router: Router,
    private fundraiserProfileService: FundraiserProfileService) {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.fundraiserProfileService.getPublicProfile().subscribe((profile) => {
          if (profile) {
            this.publicProfile = new FundraiserProfile(profile);
          }
          this.userLoaded = true;
        });
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
      this.publicProfile.entityName = this.user.entityName;
      this.publicProfile.email = this.user.email;
      if (!this.publicProfile.isFilled) {
        this.publicProfile.isFilled = true;
        this.fundraiserProfileService.addPublicProfile(this.user.uid, this.publicProfile, this.publicProfileFile);
      } else {
        this.fundraiserProfileService.updatePublicProfile(this.user.uid, this.publicProfile, this.publicProfileFile);
      }
      this.showPublicProfileForm = false;
    } else if (this.publicProfile.allParamsAreFilled() && this.publicProfile.isFilled) {
      this.fundraiserProfileService.updatePublicProfile(this.user.uid, this.publicProfile);
      this.showPublicProfileForm = false;
    } else {
      alert('You won\'t be able to save your public profile unless you fill all the parameters.');
    }
  }

  onPublicProfileFormCancel() {
    this.showPublicProfileForm = false;
  }

  onPublicProfileLogoUploaded($event) {
    const e = event as any;
    this.publicProfileFile = e.target.files[0];
  }

  onPublicProfileWebsiteLinkClicked() {
    console.log(this.publicProfile.websiteURL);
    window.location.href = this.publicProfile.websiteURL;
  }

}
