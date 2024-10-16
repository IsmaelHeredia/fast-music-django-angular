import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, Validators } from '@angular/forms';

import { MaterialModule } from '../../material.module';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

import { ToastrService } from 'ngx-toastr';

import { SyncService } from '../../services/sync.service';

import { BehaviorSubject } from 'rxjs';

export interface DialogData {
  content: string;
}

@Component({
  selector: 'app-sync',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './sync.component.html',
  styleUrl: './sync.component.scss'
})
export class SyncComponent {

  id_config: number = 0;
  syncForm: any;
  isReady: boolean = false;

  timer: any = null;
  sync_working: boolean = false;
  sync_id: number = 0;
  sync_logs: string = "";
  sync_status: number = 0;

  private loadingSubject =
    new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  readonly dialog = inject(MatDialog);

  constructor(
    public syncService: SyncService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cd: ChangeDetectorRef,
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

    this.syncForm = this.formBuilder.group({
      song_directory_gd: ['', Validators.required],
    });

    this.loadConfig();

  }

  loadConfig(): void {
    this.syncService.getConfiguracion().subscribe({
      next: (res: any) => {

        const estado = res.estado;
        const mensaje = res.mensaje;

        if (estado == 1) {
          const datos = res.datos;
          const id_config = datos.id;
          const song_directory_gd = datos.song_directory_gd;

          this.id_config = id_config;

          this.syncForm.patchValue(
            {
              song_directory_gd: song_directory_gd
            }
          );

          this.isReady = true;
        } else {
          this.toastr.warning(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });
          this.isReady = false;
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  submitForm(): void {
    if (this.syncForm?.valid) {
      if (this.id_config == 0) {

        this.loadingSubject.next(true);

        this.syncService.postConfiguracion(this.syncForm.value).subscribe({
          next: (res: any) => {

            const estado = res.estado;
            const mensaje = res.mensaje;

            if (estado == 1) {

              this.toastr.success(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });

              this.loadConfig();

              this.loadingSubject.next(false);

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

      } else {

        this.loadingSubject.next(true);

        this.syncService.patchConfiguracion(this.syncForm.value).subscribe({
          next: (res: any) => {

            const estado = res.estado;
            const mensaje = res.mensaje;

            if (estado == 1) {

              this.toastr.success(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });

              this.loadConfig();

              this.loadingSubject.next(false);

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

  sync_from_gd(): void {

    const dialogRef = this.dialog.open(DialogConfirmDialog, {
      height: '30%',
      width: '60%',
      data: { content: 'Esta seguro de sincronizar desde Google Drive ?' },
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result !== undefined && result == true) {

        this.loadingSubject.next(true);

        this.syncService.getSincronizarGD().subscribe({
          next: (res: any) => {

            const estado = res.estado;
            const mensaje = res.mensaje;

            if (estado == 1) {

              //this.toastr.success(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });

              console.log(res.datos);

              this.sync_id = res.datos.sync_id;

              this.sync_working = true;

              //console.log('se inicio sync con id ', this.sync_id);

              this.startTimer();

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

    });
  }

  sync_from_pc(): void {

    const dialogRef = this.dialog.open(DialogConfirmDialog, {
      height: '30%',
      width: '60%',
      data: { content: 'Esta seguro de sincronizar desde PC ?' },
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result !== undefined && result == true) {

        this.loadingSubject.next(true);

        this.syncService.getSincronizarPC().subscribe({
          next: (res: any) => {

            const estado = res.estado;
            const mensaje = res.mensaje;

            if (estado == 1) {

              //this.toastr.success(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });

              console.log(res.datos);

              this.sync_id = res.datos.sync_id;

              this.sync_working = true;

              //console.log('se inicio sync con id ', this.sync_id);

              this.startTimer();

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

    });

  }

  close_sync(): void {
    this.sync_working = false;
  }

  startTimer() {

    this.stopTimer();

    this.timer = setInterval(() => {

      //console.log('cada 5 segundo consulto al timer de sync');

      this.syncService.getEstadoSincronizacion(this.sync_id).subscribe({
        next: (res: any) => {

          const estado = res.estado;

          if (estado == 1) {

            const datos = res.datos;
            const logs = datos.logs;
            const status = datos.status;

            this.sync_logs = logs;
            this.sync_status = status;

            if (status == 1) {
              //console.log('el estado de la sync es 1, termina');
              clearInterval(this.timer);
              this.loadingSubject.next(false);
            }

            this.cd.detectChanges();

          }
        },
        error: error => {
          this.toastr.error(error, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });
          console.log(error);
        }
      });

    }, 5000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.sync_status = 0;
      this.sync_logs = "";
      //this.sync_working = false;
      //('stop timer activado');
    }
  }

}

@Component({
  selector: 'dialog-confirm-dialog',
  templateUrl: 'dialog-confirm-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogConfirmDialog {

  readonly dialogRef = inject(MatDialogRef<DialogConfirmDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly content = model(this.data.content);

}
