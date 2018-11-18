import { Transaction } from './../../models/transaction';
import { TransactionsService } from './../../services/transactions.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  user: User;
  transactions: Transaction[];
  hasTransactions = false;
  userLoaded = false;

  constructor(private authService: AuthService, private transactionService: TransactionsService) {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.userLoaded = true;
        this.user = user;
        if (user.isAgricultureCompany) {
          this.transactionService.getAllTransactionsWithToId(user.uid).subscribe((transactions) => {
            if (transactions && transactions.length > 0)  {
              this.transactions = transactions;
              this.hasTransactions = true;
            }
          });
        } else {
          this.transactionService.getAllTransactionsWithFromId(user.uid).subscribe((transactions) => {
            if (transactions && transactions.length > 0) {
              this.transactions = transactions;
              this.hasTransactions = true;
            }
          });
        }
      }
    });
   }

  ngOnInit() {
  }

  onFromAgricultureCompanyAccept(transaction: Transaction) {
    transaction.status = 'Accepted and waiting transaction';
    transaction.acceptedByTo = true;
    transaction.availableForEthTransaction = true;
    this.transactionService.updateTransaction(transaction);
  }

  onFromAgricultureCompanyDeny(transaction: Transaction) {
    transaction.status = 'Denied';
    transaction.acceptedByFrom = false;
    transaction.denied = true;
    this.transactionService.updateTransaction(transaction);
  }

  onFromNGOCompanyFinishedEthTransaction(transaction: Transaction) {
    transaction.status = 'Ethereum transaction completed';
    transaction.ethTransactionCompleted = true;
    this.transactionService.updateTransaction(transaction);
  }

  onFromNGOCompanyStandby(transaction: Transaction) {
    transaction.status = 'Standbyed by giving company';
    transaction.acceptedByTo = false;
    this.transactionService.updateTransaction(transaction);
  }

  onFromNGOCompanyDelete(transaction: Transaction) {
    this.transactionService.deleteTransaction(transaction);
    window.location.reload();
  }

}
