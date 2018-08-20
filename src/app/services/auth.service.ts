import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs-compat';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User>;

  constructor(public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router) {
      this.user = this.afAuth.authState.switchMap(
        user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            return Observable.of(null);
          }
        }
      );
  }

  getUser() {
    return this.user;
  }

  googleLogin() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  public getUserFromFirestore(user) {
    return this.afs.doc(`users/${user.uid}`).valueChanges();
  }

  public createUserInFirestore(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      finishedForm: false
    };
    return userData;
    userRef.set(userData);
  }

  public updateUserInFirestore(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    userRef.set(user);
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }
}
