import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  closeResult: string;

  @ViewChild('openModal') myOpenModalBtn: ElementRef;

  user: User = {
    uid: '',
    email: '',
    finishedForm: false,
    entityName: '',
    description: '',
    isAgricultureCompany: false,
    ethereumId: ''
  };

  constructor(private authService: AuthService,
    private modalService: NgbModal,
    private router: Router) {
     }

  ngOnInit() {
  }

  onGoogleSignIn() {
    this.authService.googleLogin()
      .then(credential => {
        this.authService.getUserFromFirestore(credential.user).take(1).subscribe(userData => {
          if (userData) {
            this.user = userData as User;
            console.log('entro aca');
            if (!this.user.finishedForm) {
              const openModal: HTMLElement = this.myOpenModalBtn.nativeElement as HTMLElement;
              openModal.click();
            } else {
              this.router.navigate(['/dashboard']);
            }
          } else {
            this.user = this.authService.createUserInFirestore(credential.user);
            const openModal: HTMLElement = this.myOpenModalBtn.nativeElement as HTMLElement;
            openModal.click();
          }
        });
      });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log('this.isUserFormFilled()', this.isUserFormFilled());
      if (this.isUserFormFilled()) {
        this.user.finishedForm = true;
        this.authService.updateUserInFirestore(this.user);
        this.router.navigate(['/dashboard']);
      } else {
        this.user.finishedForm = false;
        this.authService.updateUserInFirestore(this.user);
        alert('You missed to complete all input from the form. Please fill them to continue');
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.user.finishedForm = false;
      this.emptyUserInterface(this.user);
      alert('You wont be able to continue unless you finish the form');
    });
  }

  isUserFormFilled(): boolean {
    return this.user.entityName !== undefined && this.user.entityName !== ''
    && this.user.description !== undefined && this.user.description !== ''
    && this.user.ethereumId !== undefined && this.user.ethereumId !== '';
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private emptyUserInterface = (user: User) => {
    user.entityName = '';
    user.isAgricultureCompany = false;
    user.description = '';
    user.ethereumId = '';
  }

}
