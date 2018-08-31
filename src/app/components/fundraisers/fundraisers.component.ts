import { Router } from '@angular/router';
import { FundraiserProfileService } from './../../services/fundraiser-profile.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { FundraiserProfile } from '../../models/fundraiserProfile';

@Component({
  selector: 'app-fundraisers',
  templateUrl: './fundraisers.component.html',
  styleUrls: ['./fundraisers.component.css']
})

export class FundraisersComponent implements OnInit {

  user: User;
  fundraiserProfiles: FundraiserProfile[];

  constructor(private authService: AuthService, private fundraiserProfileService: FundraiserProfileService, private router: Router) {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.user = user;
      }
      this.fundraiserProfileService.getAllFundraiserProfiles().subscribe(fundraiserProfiles => {
        this.fundraiserProfiles = fundraiserProfiles;
      });
    });
  }

  ngOnInit() {
  }

  onGiveFunds(fundraiserProfile: FundraiserProfile) {
    this.router.navigate(['/make-transaction'], { queryParams: {fundraiserProfileId: fundraiserProfile.userId}});
  }

}
