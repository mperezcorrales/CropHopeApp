import { FundraiserProfile } from './../../models/fundraiserProfile';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user';

@Component({
  selector: 'app-fundraiser-profile',
  templateUrl: './fundraiser-profile.component.html',
  styleUrls: ['./fundraiser-profile.component.css']
})
export class FundraiserProfileComponent implements OnInit {

  @Input() fundraiserProfile: FundraiserProfile;
  @Input() fromFundraiserList = true;
  @Input() user: User;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onGiveFundsEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onFundraiserProfileWebsiteLinkClicked() {
    console.log(this.fundraiserProfile.websiteURL);
    window.location.href = this.fundraiserProfile.websiteURL;
  }

  onGiveFundsClicked() {
    this.onGiveFundsEvent.emit(this.fundraiserProfile);
  }

}
