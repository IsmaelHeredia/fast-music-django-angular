import { ChangeDetectorRef, Component, Renderer2, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material.module';

import { FormBuilder, Validators } from '@angular/forms';

import { LoginService } from '../services/auth/login.service';

import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { ToastrService } from 'ngx-toastr';

import { Store, select } from '@ngrx/store';
import { Theme } from '../theme/theme';
import { ThemeService } from '../theme/theme.service';
import { AppState } from '../states/app.state';
import { selectCurrentTheme } from '../states/themes/selectors/app.selector';
import { setTheme } from '../states/themes/action/app.action';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  userForm: any;
  themes: any;

  currentTheme: string = '';

  private loadingSubject =
    new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(
    public loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private themeService: ThemeService,
    private renderer2: Renderer2,
    private cd: ChangeDetectorRef,
    private store: Store<AppState>) { }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  initialize() {

    this.themes = this.store.pipe(select(selectCurrentTheme));

    this.themes.subscribe((data: string) => {
      this.currentTheme = data;
    });

    if (this.currentTheme == 'light') {
      this.themeService.setTheme(Theme.LIGHT, this.renderer2);
    }

    if (this.currentTheme == 'dark') {
      this.themeService.setTheme(Theme.DARK, this.renderer2);
    }

    this.cd.detectChanges();
  }

  clickChangeTheme() {
    if (this.currentTheme == 'light') {
      this.themeService.setTheme(Theme.DARK, this.renderer2);
      this.store.dispatch(setTheme({ mode: 'dark' }));
    } else {
      this.themeService.setTheme(Theme.LIGHT, this.renderer2);
      this.store.dispatch(setTheme({ mode: 'light' }));
    }
    this.cd.detectChanges();
  }

  changeTheme(theme: any) {
    this.themeService.setTheme(theme, this.renderer2);
  }

  ngOnInit(): void {

    this.userForm = this.formBuilder.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
    });

    this.initialize();

  }

  submitForm(): void {
    if (this.userForm?.valid) {

      const datos = {
        'username': this.userForm.value.usuario,
        'password': this.userForm.value.clave
      };

      this.loadingSubject.next(true);

      this.loginService.login(datos).subscribe(
        {
          next: (res: any) => {
            const token = res.access;
            if (token != null && token != "") {
              sessionStorage.setItem(environment.sessionName, token);
              this.toastr.success('El usuario fue logeado correctamente', '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });
              setTimeout(() => {
                this.router.navigateByUrl('player/home');
              }, Number(environment.timeoutRedirect));
            }
          },
          error: error => {
            const message = String(error);
            if (message.includes('401 Unauthorized')) {
              this.toastr.warning('Los datos de ingreso son incorrectos', '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });
            } else {
              this.toastr.error(error, '', { timeOut: environment.timeoutToast, positionClass: 'toast-bottom-center' });
            }
            this.loadingSubject.next(false);
          }
        }
      );
    }
  }

}
