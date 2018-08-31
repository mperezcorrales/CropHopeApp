import { Transaction } from './../models/transaction';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs-compat';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  transactionCollection: AngularFirestoreCollection<Transaction>;

  constructor(private afs: AngularFirestore) {
    this.transactionCollection = afs.collection<Transaction>('transactions');
  }

  addTransaction(transaction: Transaction) {
    return this.transactionCollection.add(transaction);
  }

  updateTransaction(transaction: Transaction) {
    this.transactionCollection.doc(transaction.id).update(transaction);
  }

  deleteTransaction(transaction: Transaction) {
    this.transactionCollection.doc(transaction.id).delete();
  }

  getAllTransactionsWithFromId(fromId: string): Observable<Transaction[]> {
    const transactionQueried = this.afs.collection('transactions', ref => ref.where('fromId', '==', fromId));
    return transactionQueried.snapshotChanges().map(documents => {
      return documents.map(transaction => {
        if (transaction) {
          const data = transaction.payload.doc.data() as Transaction;
          data.id = transaction.payload.doc.id;
          return data;
        } else {
          return null;
        }
      });
    });
  }

  getAllTransactionsWithToId(toId: string): Observable<Transaction[]> {
    const transactionQueried = this.afs.collection('transactions', ref => ref.where('toId', '==', toId));
    return transactionQueried.snapshotChanges().map(documents => {
      return documents.map(transaction => {
        const data = transaction.payload.doc.data() as Transaction;
        console.log(data);
        data.id = transaction.payload.doc.id;
        return data;
      });
    });
  }
}
