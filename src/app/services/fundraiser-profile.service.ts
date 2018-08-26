import { FundraiserProfile } from './../models/fundraiserProfile';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FundraiserProfileService {

  fundraiserProfiles: AngularFirestoreCollection<FundraiserProfile>;

  constructor(private afs: AngularFirestore, private angularStorage: AngularFireStorage) {
    this.fundraiserProfiles = this.afs.collection('fundraiser-profiles');
  }

  addPublicProfile(userId: string, profile: FundraiserProfile, logoFile: File) {
    const id = this.afs.createId();
    const fundraiserLogoAddress = `fundraiser-logo/${userId}/logo.png`;
    const fileRef = this.angularStorage.ref(fundraiserLogoAddress);
    const task = this.angularStorage.upload(fundraiserLogoAddress, logoFile);
    task.snapshotChanges().pipe(finalize(() => {
      fileRef.getDownloadURL().subscribe((downloadURL => {
        profile.logoStorageURL = downloadURL;
        this.fundraiserProfiles.doc(id).set(profile);
      }));
    }));
  }
}
