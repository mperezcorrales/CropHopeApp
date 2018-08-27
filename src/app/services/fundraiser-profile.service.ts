import { FundraiserProfile } from './../models/fundraiserProfile';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs-compat';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class FundraiserProfileService {

  fundraiserProfilesCollection: AngularFirestoreCollection<FundraiserProfile>;
  userFundraiserProfile: Observable<FundraiserProfile>;

  constructor(private afs: AngularFirestore, private angularStorage: AngularFireStorage, public afAuth: AngularFireAuth) {
    this.fundraiserProfilesCollection = this.afs.collection('fundraiser-profiles');
    this.userFundraiserProfile = this.afAuth.authState.switchMap(
      user => {
        if (user) {
          return this.afs.doc<FundraiserProfile>(`fundraiser-profiles/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      }
    );
  }

  getPublicProfile(): Observable<FundraiserProfile> {
    return this.userFundraiserProfile;
  }

  addPublicProfile(userId: string, profile: FundraiserProfile, logoFile: File) {
    const fundraiserLogoAddress = `fundraiser-logo/${userId}/logo.png`;
    const fileRef = this.angularStorage.ref(fundraiserLogoAddress);
    this.angularStorage.upload(fundraiserLogoAddress, logoFile).then(() => {
      fileRef.getDownloadURL().subscribe(url => {
        profile.logoStorageURL = url;
        profile.userId = userId;
        this.fundraiserProfilesCollection.doc(userId).set(Object.assign({}, profile));
      });
    });
  }

  updatePublicProfile(userId: string, profile: FundraiserProfile, logoFile: File = null, ) {
    const fundraiserLogoAddress = `fundraiser-logo/${userId}/logo.png`;
    const fileRef = this.angularStorage.ref(fundraiserLogoAddress);
    if (logoFile) {
      this.angularStorage.upload(fundraiserLogoAddress, logoFile).then(() => {
        fileRef.getDownloadURL().subscribe(url => {
          profile.logoStorageURL = url;
          profile.userId = userId;
          this.fundraiserProfilesCollection.doc(userId).update(Object.assign({}, profile));
        });
      });
    } else {
      profile.userId = userId;
      this.fundraiserProfilesCollection.doc(userId).update(Object.assign({}, profile));
    }
  }

  getAllFundraiserProfiles() {
    return this.fundraiserProfilesCollection.valueChanges();
  }

  getSpecificUserFundraiserProfile(fundraiserProfileId) {
    return this.afs.doc<FundraiserProfile>(`fundraiser-profiles/${fundraiserProfileId}`).valueChanges();
  }

}
