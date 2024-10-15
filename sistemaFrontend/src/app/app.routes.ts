import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlayerComponent } from './layout/player/player.component';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './dashboard/home/home.component';
import { StationsComponent } from './dashboard/stations/stations.component';
import { SaveStationComponent } from './dashboard/stations/save/save.component';
import { ScanComponent } from './dashboard/scan/scan.component';
import { SyncComponent } from './dashboard/sync/sync.component';
import { AccountComponent } from './dashboard/account/account.component';

import { HomeGuard } from './guards/home.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/ingreso', pathMatch: 'full' },
  { path: 'ingreso', component: LoginComponent, canActivate: [HomeGuard] },
  {
    path: 'player', component: PlayerComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'stations', component: StationsComponent },
      { path: 'stations/save', component: SaveStationComponent },
      { path: 'stations/:id_station/edit', component: SaveStationComponent },
      { path: 'scan', component: ScanComponent },
      { path: 'sync', component: SyncComponent },
      { path: 'account', component: AccountComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }