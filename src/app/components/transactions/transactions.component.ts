import { EthcontractService } from './../../services/eth-contract.service';
import { Transaction } from './../../models/transaction';
import { TransactionsService } from './../../services/transactions.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  foundEthereumAddress = 'Not found';
  foundEthereumBalance = 'Not found';
  ethAccountConnectionFound = false;
  contractDetailsRequiredCarbonPercDecrease = '';
  contractDetailsCarbonReducProgress = '';
  contractDetailsContractCompleted: boolean;

  @ViewChild('openModal') myOpenModalBtn: ElementRef;

  constructor(private authService: AuthService, private transactionService: TransactionsService,
    private ethContractService: EthcontractService, private modalService: NgbModal) {
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
          this.initAndDisplayAccount();
        }
      }
    });
   }

  ngOnInit() {
  }

  initAndDisplayAccount = () => {
    const that = this;
    this.ethContractService.getAccountInfo().then(function(acctInfo: any) {
      that.foundEthereumAddress = acctInfo.fromAccount;
      that.foundEthereumBalance = acctInfo.balance;
      that.ethAccountConnectionFound = true;
    }).catch(function(error) {
      console.log(error);
    });

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
    const that = this;
    this.ethContractService.transferEther(
      this.foundEthereumAddress,
      transaction.toEthAddress,
      transaction.amount,
      transaction.carbonReductionPerc,
      transaction.transactionEthId
    ).then(function() {
      console.log('Success');
    }).catch(function(error) {
      console.log('error: ', error);
    });
    this.listenForEvents(transaction);
  }

  listenForEvents(transaction) {
    const that = this;
    this.ethContractService.getTransactionContractInstance().deployed().then(function (instance) {
      instance.TransferFund({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) {
        if (transaction.transactionEthId === event.args._transactionMapKey.toNumber()) {
          if (!transaction.ethTransactionCompleted) {
            transaction.status = 'Ethereum transaction completed';
            transaction.ethTransactionCompleted = true;
            that.transactionService.updateTransaction(transaction);
            that.initAndDisplayAccount();
          }
        } else {
          console.log('Outside if');
        }
        // Reload when a new vote is recorded
      });
    });
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

  onViewTransactionContract(transaction: Transaction) {
    const that = this;
    this.ethContractService.getSingleTransactionWithMapKey(transaction.transactionEthId).then((transactionReceived) => {
      console.log('final transactionReceived:', transactionReceived);
      console.log('read transaction:', transactionReceived[0].toNumber());
      console.log('read transaction:', transactionReceived[1].toNumber());
      console.log('read transaction:', transactionReceived[2]);
      that.contractDetailsRequiredCarbonPercDecrease =  (transactionReceived[0].toNumber()).toString() + '%';
      that.contractDetailsCarbonReducProgress = (transactionReceived[1].toNumber()).toString() + '%';
      that.contractDetailsContractCompleted = transactionReceived[2];
      const openModal: HTMLElement = that.myOpenModalBtn.nativeElement as HTMLElement;
      openModal.click();
    });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onUpdateCarbonProgress(transaction) {
    if (transaction.carbonReductionProg) {
      // tslint:disable-next-line:max-line-length
      this.ethContractService.editTransactionCarbonReducProgress(transaction.transactionEthId, transaction.carbonReductionProg).then(status => {
        console.log(status);
      });
    }
  }

}
