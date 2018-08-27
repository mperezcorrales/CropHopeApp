import { Transaction } from './../../models/transaction';
import { FundraiserProfileService } from './../../services/fundraiser-profile.service';
import { User } from './../../models/user';
import { AuthService } from './../../services/auth.service';
import { FundraiserProfile } from './../../models/fundraiserProfile';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-make-transaction',
  templateUrl: './make-transaction.component.html',
  styleUrls: ['./make-transaction.component.css']
})
export class MakeTransactionComponent implements OnInit {

  fundraiserProfileId: string;
  fundraiserProfile;
  user: User;
  loaded = false;
  transaction: Transaction = {
    fromId: '',
    toId: '',
    carbonReductionPerc: '',
    timeWindow: '',
    currentDate: '',
    amount: '',
  };

  constructor(private authService: AuthService, private route: ActivatedRoute,
    private fundraiserProfileService: FundraiserProfileService, private location: Location) {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.route.queryParams.subscribe((params) => {
          this.fundraiserProfileId = params.fundraiserProfileId;
          this.fundraiserProfileService.getSpecificUserFundraiserProfile(this.fundraiserProfileId).subscribe((fundraiserProfile => {
            this.fundraiserProfile = fundraiserProfile;
            this.transaction.fromId = this.user.uid;
            this.transaction.toId = fundraiserProfile.userId;
            this.loaded = true;
          }));
        });
      }
    });
  }

  ngOnInit() {
  }

  onTransactionAccepted() {
    console.log('yes');
  }

  onTransactionCancelled() {
    this.location.back();
  }

}
