import { ChangeDetectionStrategy, Component, inject, signal, effect, model, Injectable, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder } from '@angular/forms';

import { MaterialModule } from '../../material.module';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { Router, RouterOutlet, RouterModule } from '@angular/router';

import { StationsService } from '../../services/stations.service';

import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../environments/environment';

import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { setStationName } from '../../states/filters/action/app.action';
import { selectStationName } from '../../states/filters/selectors/app.selector';

import { Howl, Howler } from "howler";

export interface DialogData {
  id: number;
  name: string;
}

@Component({
  selector: 'app-stations',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    MaterialModule
  ],
  templateUrl: './stations.component.html',
  styleUrl: './stations.component.scss'
})
export class StationsComponent {

  filterForm: any;
  stations_bd: any = [];
  stations: any = [];
  dataSource = this.stations;
  displayedColumns: string[] = ['name', 'link', 'categories', 'option'];

  data: any;

  filters: any;
  filter_name: any;

  current_id_station: number = 0;
  is_playing: boolean = false;

  audio: any = null;

  private loadingSubject =
    new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  readonly dialog = inject(MatDialog);

  constructor(
    public stationsService: StationsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private store: Store<any>) { }

  ngOnInit(): void {

    this.store.pipe(select(selectStationName)).subscribe((data: string) => {
      this.filter_name = data;
    });

    this.filterForm = this.formBuilder.group({
      buscarNombre: [this.filter_name],
    });

    this.loadStations();
  }

  loadStations(): void {

    this.loadingSubject.next(true);

    this.stationsService.getStations().subscribe({
      next: (res: any) => {
        const estado = res.estado;
        if (estado == 1) {

          const estaciones = res.datos;

          this.stations_bd = estaciones;

          if (this.filter_name != "") {
            let result = this.filterTable(this.filter_name);
            this.stations = result;
          } else {
            this.stations = estaciones;
          }

          this.cd.detectChanges();

          this.loadingSubject.next(false);
        }
      },
      error: error => {
        console.log(error);
        this.loadingSubject.next(false);
      }
    });

  }

  filterTable(buscarNombre: string): void {
    let result: any = [];

    this.stations_bd.forEach(function (station: { name: any; }) {
      let name_check = station.name;
      if (name_check.toLowerCase().indexOf(buscarNombre.toLowerCase()) > -1) {
        result.push(station);
      }
    });

    return result;
  }

  filterStations(): void {

    const datosForm = this.filterForm.value;

    let buscarNombre = datosForm['buscarNombre'];

    this.store.dispatch(setStationName({ station_name: buscarNombre }));

    let result = this.filterTable(buscarNombre);

    this.stations = result;
    this.dataSource = this.stations;
  }

  clearFilter(): void {

    this.filterForm.patchValue({ buscarNombre: '' });

    this.store.dispatch(setStationName({ station_name: '' }));

    this.loadStations();

  }

  playStation(id: number, link: string): void {

    if (this.audio != null) {
      this.audio.stop();
      this.audio = null;
    }

    if (this.is_playing && id == this.current_id_station) {

      this.current_id_station = 0;
      this.is_playing = false;

    } else {

      this.current_id_station = id;
      this.is_playing = true;

      this.audio = new Howl({
        src: link,
        format: ["mp3"],
        autoplay: true,
        html5: true,
      });

      this.audio.play();

    }

  }

  onFileSelected(event: any) {

    const file: File = event.target.files[0];

    if (file) {

      let data = {
        jsonfile: file,
      };

      this.stationsService.postImport(data).subscribe({
        next: (res: any) => {
          const estado = res.estado;
          const mensaje = res.mensaje;
          if (estado == 1) {

            this.toastr.success(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });

            this.loadStations();

          } else {
            this.toastr.warning(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });
          }
        },
        error: error => {
          this.toastr.error(error, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });
          console.log(error);
        }
      });

    }

  }

  export(): void {

    const stationsContent = JSON.stringify(this.stations_bd, null, 4);
    const filename = "stations_exported.json";

    const blob = new Blob([stationsContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);

    const mensaje = "Las estaciones fueron exportadas correctamente";

    this.toastr.success(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });

  }

  validate(): void {

    this.toastr.success('Validando estaciones registradas ...', '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });

    this.stationsService.getValidate().subscribe({
      next: (res: any) => {
        const estado = res.estado;
        const mensaje = res.mensaje;
        if (estado == 1) {

          this.store.dispatch(setStationName({ station_name: '' }));

          this.toastr.success(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });

          this.loadStations();

        } else {
          this.toastr.warning(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });
        }
      },
      error: error => {
        this.toastr.error(error, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });
        console.log(error);
      }
    });

  }

  openDialogConfirmDelete(id: number, nombre: string): void {

    const dialogRef = this.dialog.open(DialogConfirmDeleteDialog, {
      height: '20%',
      width: '60%',
      data: { id: id, name: nombre },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loadStations();
      }
    });
  }

}

@Component({
  selector: 'dialog-confirm-delete-dialog',
  templateUrl: 'dialog-confirm-delete-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogConfirmDeleteDialog {

  readonly dialogRef = inject(MatDialogRef<DialogConfirmDeleteDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly station_id = model(this.data.id);
  readonly station_name = model(this.data.name);

  constructor(
    public stationsService: StationsService,
    private router: Router,
    private toastr: ToastrService) { }

  confirmDelete(id: number): void {

    this.stationsService.deleteStation(id).subscribe({
      next: (res: any) => {
        const estado = res.estado;
        const mensaje = res.mensaje;
        if (estado == 1) {

          this.toastr.success(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });

          setTimeout(() => {
            this.router.navigateByUrl('player/stations');
          }, Number(environment.timeoutRedirect));

        } else {
          this.toastr.warning(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });
        }
      },
      error: error => {
        this.toastr.error(error, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });
        console.log(error);
      }
    });

  }
}