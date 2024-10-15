import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, Validators } from '@angular/forms';

import { MaterialModule } from '../../material.module';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

import { ToastrService } from 'ngx-toastr';

import { ScanService } from '../../services/scan.service';

import { BehaviorSubject } from 'rxjs';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../states/app.state';
import { selectSongs, selectSongName, selectPlaylists } from '../../states/filters/selectors/app.selector';
import { setSongs, setSongName, setPlaylists } from '../../states/filters/action/app.action';

export interface DialogData {
  id: number;
  name: string;
}

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.scss'
})
export class ScanComponent {

  id_config: number = 0;
  scanForm: any;
  firstLoad: boolean = false;
  isReady: boolean = false;

  private loadingSubject =
    new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  readonly dialog = inject(MatDialog);

  constructor(
    public scanService: ScanService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cd: ChangeDetectorRef,
    private store: Store<AppState>,
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

    this.scanForm = this.formBuilder.group({
      song_directory: ['', Validators.required],
    });

    this.loadConfig();

    this.firstLoad = true;
  }

  loadConfig(): void {
    this.scanService.getConfiguracion().subscribe({
      next: (res: any) => {

        const estado = res.estado;
        const mensaje = res.mensaje;

        if (estado == 1) {
          const datos = res.datos;
          const id_config = datos.id;
          const song_directory = datos.song_directory;

          this.id_config = id_config;

          this.scanForm.patchValue(
            {
              song_directory: song_directory
            }
          );

          this.isReady = true;

        } else {

          if (this.firstLoad == false) {
            this.toastr.warning(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });
            this.isReady = false;
          }

        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  submitForm(): void {
    if (this.scanForm?.valid) {
      if (this.id_config == 0) {

        this.loadingSubject.next(true);

        this.scanService.postConfiguracion(this.scanForm.value).subscribe({
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

        this.scanService.patchConfiguracion(this.scanForm.value).subscribe({
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

  scan(): void {

    const dialogRef = this.dialog.open(DialogConfirmDialog, {
      height: '20%',
      width: '60%',
      data: []
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result !== undefined && result == true) {

        this.loadingSubject.next(true);

        this.scanService.getEscanear().subscribe({
          next: (res: any) => {

            const estado = res.estado;
            const mensaje = res.mensaje;

            if (estado == 1) {

              this.loadingSubject.next(false);

              this.store.dispatch(setSongName({ song_name: '' }));
              this.store.dispatch(setSongs({ songs: [] }));
              this.store.dispatch(setPlaylists({ playlists: [] }));

              this.cd.detectChanges();

              this.toastr.success(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });

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

}

@Component({
  selector: 'dialog-confirm-dialog',
  templateUrl: 'dialog-confirm-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogConfirmDialog { }
