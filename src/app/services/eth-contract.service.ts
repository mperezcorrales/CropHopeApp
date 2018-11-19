import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';

declare let require: any;
declare let window: any;

const tokenAbi = require('../../../contracts/build/contracts/Transaction.json');

@Injectable({
  providedIn: 'root'
})

export class EthcontractService {
  private web3Provider: null;
  private contracts: {};
  private transactionContract: any;
  private account = '0x0';

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    window.web3 = new Web3(this.web3Provider);
    this.transactionContract = TruffleContract(tokenAbi);
    this.transactionContract.setProvider(this.web3Provider);
    this.getAccountInfo();
  }

  getAccountInfo() {
    const that = this;
    return new Promise((resolve, reject) => {
      window.web3.eth.getCoinbase(function(err, account) {

        if (err === null) {
          that.account = account;
          // tslint:disable-next-line:no-shadowed-variable
          window.web3.eth.getBalance(account, function(err, balance) {
            if (err === null) {
              return resolve({fromAccount: account, balance: (window.web3.fromWei(balance, 'ether')).toNumber()});
            } else {
              return reject({fromAccount: 'error', balance: 0});
            }
          });
        }
      });
    });
  }

  getTransactionContractInstance() {
    return this.transactionContract;
  }

  listenForEvents() {
    return new Promise((resolve, reject) => {
      this.transactionContract.deployed().then(function(instance) {
        instance.TransferFund({}, {
          fromBlock: 0,
          toBlock: 'latest'
        }).watch(function(error, event) {
          console.log('event triggered', event);
          // Reload when a new vote is recorded
          resolve({event: event});
        });
      });
    });
  }

  transferEther(
    _transferFrom,
    _transferTo,
    _amount,
    _carbonReducPerc,
    _transactionId,
  ) {
    const that = this;
    return new Promise((resolve, reject) => {

      this.transactionContract.deployed().then(function(instance) {
          return instance.transferFund(
            _transferTo,
            _carbonReducPerc,
            _transactionId,
            {
              from: _transferFrom,
              value: window.web3.toWei(_amount, 'ether')
            });
        }).then(function(status) {
          if (status) {
            return resolve({status: true});
          }
        }).catch(function(error) {
          console.log(error);

          return reject('Error in transferEther service call');
        });
    });
  }

  getSingleTransactionWithMapKey(_transactionMapKey) {
    const that = this;
    console.log('_transactionMapKey: ', _transactionMapKey);
    return new Promise((resolve, reject) => {
      this.transactionContract.deployed().then(function(instance) {
        return instance
          .getSingleTransactionWithMapKey.call(_transactionMapKey, { from: that.account })
          .then(function(transaction) {
            if (transaction) {
              return resolve(transaction);
            }
          })
          .catch(function(error) {
            console.log(error);
            return reject('Error in getSingleTransactionWithMapKey');
          });
      });
    });
  }

  editTransactionCarbonReducProgress(_transactionMapKey, _carbonReducProgress) {
    const that = this;
    console.log(_transactionMapKey);
    console.log(_carbonReducProgress);
    return new Promise((resolve, reject) => {
      this.transactionContract.deployed().then(function(instance) {
        return instance.editTransactionCarbonReducProgress(_transactionMapKey, _carbonReducProgress, { from: that.account })
          .then(function(status) {
            if (status) {
              return resolve({status: true});
            }
          })
          .catch(function(error) {
            console.log(error);
            return reject({status: false});
          });
      });
    });
  }

}
