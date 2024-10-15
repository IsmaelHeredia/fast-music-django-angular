import { Component, inject, ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { MaterialModule } from '../../../material.module';

import { StationsService } from '../../../services/stations.service';

import { Router } from '@angular/router';

import { ActivatedRoute } from '@angular/router';

import { environment } from '../../../../environments/environment';

import { ToastrService } from 'ngx-toastr';

import { BehaviorSubject } from 'rxjs';

interface Estado {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-save',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './save.component.html',
  styleUrl: './save.component.scss'
})
export class SaveStationComponent {

  stationForm!: FormGroup;

  private loadingSubject =
    new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  id_station: number = 0;

  name: string = '';
  link: string = '';
  categories: string = '';

  constructor(
    public stationsService: StationsService,
    private _formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private _location: Location,
  ) {
  }

  ngOnInit(): void {

    const param_id = this.activatedRoute.snapshot.paramMap.get('id_station');

    this.id_station = param_id ? Number(param_id) : 0;

    this.stationForm = this._formBuilder.group({
      name: ['', Validators.required],
      link: ['', Validators.required],
      categories: ['', Validators.required],
    });

    if (this.id_station > 0) {
      this.stationsService.getStation(this.id_station).subscribe({
        next: (res: any) => {
          const estado = res.estado;
          if (estado == 1) {
            const datos = res.datos;

            this.stationForm.patchValue(
              {
                name: datos.name,
                link: datos.link,
                categories: datos.categories,
              }
            );
          }
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }

  submitForm(): void {

    if (this.stationForm?.valid) {

      const id = this.id_station;
      const values = this.stationForm.value;

      const name = values.name;
      const link = values.link;
      const categories = values.categories;

      const datos = {
        name: name,
        link: link,
        categories: categories
      }

      if (this.id_station == 0) {

        this.loadingSubject.next(true);

        this.stationsService.postStation(datos).subscribe({
          next: (res: any) => {
            const estado = res.estado;
            const mensaje = res.mensaje;
            if (estado == 1) {

              this.toastr.success(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });

              setTimeout(() => {
                this.router.navigateByUrl('player/stations');
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

      } else {

        this.loadingSubject.next(true);

        this.stationsService.putStation(id, datos).subscribe({
          next: (res: any) => {
            const estado = res.estado;
            const mensaje = res.mensaje;
            if (estado == 1) {

              this.toastr.success(mensaje, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });

              setTimeout(() => {
                this.router.navigateByUrl('player/stations');
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

  returnBack() {
    this._location.back();
  }

}
