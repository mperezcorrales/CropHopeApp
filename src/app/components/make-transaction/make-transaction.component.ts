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

  givingToFundraiserProfileId: string;
  givingToFundraiserProfile;
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
    fromName: '',
    availableForEthTransaction: false,
    ethTransactionCompleted: false,
    fromEthAddress: '',
    toEthAddress: ''
  };

  constructor(private authService: AuthService, private route: ActivatedRoute,
    private fundraiserProfileService: FundraiserProfileService, private location: Location,
    private transactionService: TransactionsService, private router: Router) {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.route.queryParams.subscribe((params) => {
          this.givingToFundraiserProfileId = params.fundraiserProfileId;
          this.fundraiserProfileService.getSpecificUserFundraiserProfile(this.givingToFundraiserProfileId).subscribe((fundraiserProfile => {
            this.givingToFundraiserProfile = fundraiserProfile;
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
    this.transaction.toId = this.givingToFundraiserProfile.userId;
    this.transaction.toEthAddress = this.givingToFundraiserProfile.userEthAddress;
    this.transaction.givingToCompanyName = this.givingToFundraiserProfile.entityName;
    this.transaction.currentDate = getDate();
    this.transaction.status = 'Waiting to be accepted.';
    this.transaction.accepted = false;
    this.transaction.denied = false;
    this.transaction.transactionEthId = Math.floor(Math.random() * (50000 - 1 + 1)) + 1;
  }

  areAllTransactionParametersFilled() {
    console.log(this.transaction);
    return this.transaction.toId !== '' && this.transaction.fromId !== '' && this.transaction.carbonReductionPerc !== ''
      && this.transaction.timeWindow !== '' && this.transaction.currentDate !== '' && this.transaction.amount !== '';
  }

  onUsedCustomizedContract() {
    alert('No customized contracts were found');
  }

}
