import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { FundraisersComponent } from './components/fundraisers/fundraisers.component';
import { MakeTransactionComponent } from './components/make-transaction/make-transaction.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent},
  { path: 'transactions', component: TransactionsComponent},
  { path: 'make-transaction', component: MakeTransactionComponent},
  { path: 'fundraisers', component: FundraisersComponent},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent}
];

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class AppRoutingModule { }
