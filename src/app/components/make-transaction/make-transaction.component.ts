import { TransactionsService } from './../../services/transactions.service';
import { Transaction } from './../../models/transaction';
import { FundraiserProfileService } from './../../services/fundraiser-profile.service';
import { User } from './../../models/user';
import { AuthService } from './../../services/auth.service';
import { FundraiserProfile } from './../../models/fundraiserProfile';
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, getLocaleDateFormat } from '@angular/common';
import { getDate } from '../../utils';

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
    acceptedByFrom: false,
    toId: '',
    acceptedByTo: false,
    carbonReductionPerc: '',
    timeWindow: '',
    currentDate: '',
    amount: '',
    givingToCompanyName: '',
    fromEmail: '',
    fromName: ''
  };

  constructor(private authService: AuthService, private route: ActivatedRoute,
    private fundraiserProfileService: FundraiserProfileService, private location: Location,
    private transactionService: TransactionsService, private router: Router) {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.route.queryParams.subscribe((params) => {
          this.fundraiserProfileId = params.fundraiserProfileId;
          this.fundraiserProfileService.getSpecificUserFundraiserProfile(this.fundraiserProfileId).subscribe((fundraiserProfile => {
            this.fundraiserProfile = fundraiserProfile;
            this.fillDefaultTransactionParams();
            this.loaded = true;
          }));
        });
      }
    });
  }

  ngOnInit() {
  }

  onTransactionAccepted() {
    if (this.areAllTransactionParametersFilled()) {
      this.transaction.acceptedByFrom = true;
      this.transactionService.addTransaction(this.transaction).then(() => {
        this.router.navigate(['/transactions']);
      });
    } else {
      alert('Please fill all the parameters to make a transaction.');
    }
  }

  onTransactionCancelled() {
    this.location.back();
  }

  fillDefaultTransactionParams() {
    this.transaction.fromId = this.user.uid;
    this.transaction.fromName = this.user.entityName;
    this.transaction.fromEmail = this.user.email;
    this.transaction.toId = this.fundraiserProfile.userId;
    this.transaction.givingToCompanyName = this.fundraiserProfile.entityName;
    this.transaction.currentDate = getDate();
    this.transaction.status = 'Waiting to be accepted.';
    this.transaction.accepted = false;
    this.transaction.denied = false;
  }

  areAllTransactionParametersFilled() {
    console.log(this.transaction);
    return this.transaction.toId !== '' && this.transaction.fromId !== '' && this.transaction.carbonReductionPerc !== ''
      && this.transaction.timeWindow !== '' && this.transaction.currentDate !== '' && this.transaction.amount !== '';
  }

}
