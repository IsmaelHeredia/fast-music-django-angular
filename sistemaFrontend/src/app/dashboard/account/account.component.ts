import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material.module';

import { FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

import { AccountService } from '../../services/account.service';

import { ToastrService } from 'ngx-toastr';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {

  userForm: any;

  private loadingSubject =
    new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(
    public accountService: AccountService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService) { }

  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  hideNew = signal(true);

  clickEventNew(event: MouseEvent) {
    this.hideNew.set(!this.hideNew());
    event.stopPropagation();
  }

  ngOnInit(): void {

    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      new_username: ['', Validators.required],
      password: ['', Validators.required],
      new_password: ['', Validators.required],
    });

    this.accountService.getDatos().subscribe({
      next: (res: any) => {
        const estado = res.estado;
        if (estado == 1) {
          const datos = res.datos;
          this.userForm.patchValue(
            {
              username: datos.username
            }
          );
        }
      },
      error: error => {
        console.log(error);
      }
    });

  }

  submitForm(): void {

    if (this.userForm?.valid) {

      this.loadingSubject.next(true);

      this.accountService.postCambios(this.userForm.value).subscribe({
        next: (res: any) => {
          const estado = res.estado;
          const mensaje = res.mensaje;
          if (estado == 1) {

            sessionStorage.setItem(environment.sessionName, "");

            this.toastr.success(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });

            setTimeout(() => {
              this.router.navigateByUrl('/ingreso');
            }, Number(environment.timeoutRedirect));

          } else {
            this.loadingSubject.next(false);
            this.toastr.warning(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });
          }
        },
        error: error => {
          this.loadingSubject.next(false);
          this.toastr.error(error, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });
          console.log(error);
        }
      });
    }

  }

}
