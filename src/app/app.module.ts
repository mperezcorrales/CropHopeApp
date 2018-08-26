import { AngularFireStorage, AngularFireStorageModule } from 'angularfire2/storage';
import { FundraiserProfileService } from './services/fundraiser-profile.service';
import { AuthService } from './services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './/app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { LoginComponent } from './components/login/login.component';
import { FundraisersComponent } from './components/fundraisers/fundraisers.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    TransactionsComponent,
    LoginComponent,
    FundraisersComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AppRoutingModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgbModule,
    FormsModule
  ],
  providers: [
    AuthService,
    FundraiserProfileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
