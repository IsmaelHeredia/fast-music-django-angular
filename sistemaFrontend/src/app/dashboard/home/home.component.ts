import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormControl, FormBuilder } from '@angular/forms';

import { MaterialModule } from '../../material.module';

import { SongsService } from '../../services/songs.service';

import { environment } from '../../../environments/environment';

import { Howl, Howler } from "howler";
import { BehaviorSubject } from 'rxjs';

import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../states/app.state';
import { selectSongs, selectSongName, selectPlaylists } from '../../states/filters/selectors/app.selector';
import { setSongs, setSongName, setPlaylists } from '../../states/filters/action/app.action';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    public songsService: SongsService,
    private cd: ChangeDetectorRef,
    private store: Store<AppState>) {
  }

  audio: any = null;

  musicLength: string = '0:00';
  currentTime: string = '0:00';
  currentTimeInt: number = 0;

  url_song: string = "";
  title_song: string = "Seleccione una canción"
  volume: number = 70;
  time_seek: number = 0;
  duration: number = 0;
  max_song: number = 0;

  is_playing: boolean = false;
  is_paused: boolean = false;
  mode_repeat: boolean = false;

  myControl = new FormControl();

  playlists_bd: any;
  playlists: any[] = [];
  playlists_selected: any[] = [];
  playlists_selected_store: any[] = [];
  playlists_selected_chips: any[] = [];
  current_playlists: any[] = [];

  song_name_store!: string;

  private loadingSubject =
    new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  current_id_playlist: number = 0;
  current_id_song: number = 0;
  current_song_favorite: number = 0;

  timer: any = null;

  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  filterPlaylists: any[] = [];

  chipsLimit: boolean = false;
  chipsNumberLimit: number = 0;

  filterForm: any;
  songName: string = "";

  preventSingleClick = false;
  timerClick: any;
  delay!: Number;

  ngOnInit(): void {

    this.store.pipe(select(selectPlaylists)).subscribe((data: any) => {
      this.playlists_selected_store = data;
    });

    this.store.pipe(select(selectSongName)).subscribe((data: any) => {
      //console.log('song', data);
      this.song_name_store = data;
    });

    this.filterForm = this.formBuilder.group({
      name: [this.song_name_store],
    });

    this.loadSongs();
  }

  optimizeChips(playlists: any): any[] {
    const limit = 5;
    const count = playlists.length ? playlists.length : 0;
    if (count > limit) {
      this.chipsLimit = true;
      const newChips = playlists.slice(0, limit);
      this.chipsNumberLimit = count - limit;
      return newChips;
    } else {
      this.chipsLimit = false;
      return playlists;
    }
  }

  filterPlaylistsByName(value: any) {

    let name = value.target.value;

    const filter_list: any[] = [];

    this.playlists.forEach(function (playlist) {
      let name_check = playlist.name;
      if (name_check.toLowerCase().indexOf(name.toLowerCase()) > -1) {
        filter_list.push(playlist);
      }
    });

    this.filterPlaylists = filter_list;

    this.cd.detectChanges();
  }

  filterSelectedPlaylists(playlists_sel: any): any {
    let result: any[] = [];
    let favorite_done = false;
    this.playlists.forEach((playlist) => {
      let name = playlist.name;
      if (name == 'Favoritos' && favorite_done == false) {
        result.push(playlist);
        favorite_done = true;
      }
      playlists_sel.forEach(function (playlist_sel: any) {
        let name_check = playlist_sel.name;
        if (name == name_check && name != 'Favoritos') {
          result.push(playlist);
        }
      });
    });
    return result;
  }

  searchSongName(): void {

    if (this.filterForm?.valid) {

      let findName = this.filterForm.value.name;

      let playlists_filter: any = [];

      this.store.pipe(select(selectPlaylists)).subscribe((data: any) => {
        playlists_filter = data;
      });

      if (findName != "") {

        const newPlaylists: any[] = [];

        playlists_filter.forEach(function (playlist_sel: any) {

          let newData: any = {};

          newData['id'] = playlist_sel.id;
          newData['name'] = playlist_sel.name;

          let songs_filter = playlist_sel.songs;
          let filter_songs: any[] = [];
          let found_song = false;

          songs_filter.forEach(function (song: any) {
            let song_name = song.title;
            if (song_name.toLowerCase().indexOf(findName.toLowerCase()) > -1) {
              filter_songs.push(song);
              if (found_song == false) {
                found_song = true;
              }
            }
          });

          const newSongs = [...filter_songs];

          newData['songs'] = newSongs;

          if (found_song) {
            newPlaylists.push(newData);
          }

        });

        this.playlists_selected = newPlaylists;

      } else {

        let reset_playlists: any[] = [];

        playlists_filter.forEach((playlist: any) => {
          let found = false;
          this.playlists.forEach(function (playlist_selected) {
            if (playlist.id == playlist_selected.id) {
              if (found == false) {
                found = true;
              }
            }
          });
          if (found) {
            reset_playlists.push(playlist);
          }
        });

        this.playlists_selected = reset_playlists;

      }

      this.store.dispatch(setSongName({ song_name: findName }));

    }
  }

  cleanFilterSongName(): void {
    this.store.dispatch(setSongName({ song_name: '' }));

    this.filterForm.patchValue(
      {
        name: ''
      }
    );

    this.loadSongs();
  }

  favorite(): void {

    let song_id = this.current_id_song;

    let favorite = 0;

    if (this.current_song_favorite == 0) {
      favorite = 1;
    }

    //console.log('song_id', song_id);

    this.songsService.setFavorite(song_id, favorite).subscribe({
      next: (res: any) => {
        var estado = res.estado;
        if (estado == 1) {
          this.current_song_favorite = favorite;
          this.loadSongs();
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  loadSongs(): void {

    this.loadingSubject.next(true);

    this.songsService.getCanciones().subscribe({
      next: (res: any) => {
        var estado = res.estado;
        if (estado == 1) {

          //console.log('playlists', res.datos.playlists);

          var playlists = res.datos.playlists;

          this.store.dispatch(setSongs({ songs: playlists }));

          var playlists_sel: any = null;

          if (this.playlists_selected_store.length > 0) {
            playlists_sel = this.playlists_selected_store;
          } else {
            this.store.dispatch(setPlaylists({ playlists: playlists }));
            playlists_sel = res.datos.playlists_most_used;
          }

          this.playlists = playlists;
          this.filterPlaylists = playlists;

          this.store.select(selectSongs).subscribe({
            next: (songs: any) => {
              this.playlists = songs;
            },
          });

          this.playlists_selected = this.filterSelectedPlaylists(playlists_sel);
          this.playlists_selected_chips = this.optimizeChips(this.playlists_selected);

          this.loadingSubject.next(false);

          if (this.song_name_store != "") {
            this.searchSongName();
          }

          this.cd.detectChanges();
        }
      },
      error: error => {
        this.loadingSubject.next(false);
        console.log(error);
      }
    });

  }

  addPlaylist(playlist: any): void {

    if (!this.playlists_selected.includes(playlist)) {
      //console.log('add', playlist.name);
      this.playlists_selected = [...this.playlists_selected, playlist];
    } else {
      this.playlists_selected = this.playlists_selected.filter(pl => pl.id !== playlist.id);
    }

    this.playlists_selected_chips = this.optimizeChips(this.playlists_selected);

    this.store.dispatch(setPlaylists({ playlists: this.playlists_selected }));

    let result = null;

    this.store.pipe(select(selectPlaylists)).subscribe((data: any) => {
      result = data;
    });

    //console.log('add playlist', result);

    this.cd.detectChanges();
  }

  removePlaylist(playlist: any): void {
    //console.log('remove', playlist.name);

    this.playlists_selected = this.playlists_selected.filter(pl => pl.id !== playlist.id);

    this.playlists_selected_chips = this.optimizeChips(this.playlists_selected);

    this.store.dispatch(setPlaylists({ playlists: this.playlists_selected }));

    let result = null;

    this.store.pipe(select(selectPlaylists)).subscribe((data: any) => {
      result = data;
    });

    //console.log('remove playlist', result);

    this.cd.detectChanges();
  }

  cleanPlaylists(): void {

    this.store.dispatch(setSongs({ songs: [] }));
    this.store.dispatch(setPlaylists({ playlists: [] }));

    this.playlists = [];
    this.playlists_selected = [];
    this.playlists_selected_chips = [];

    this.chipsLimit = false;

    this.cd.detectChanges();

  }

  startTimer() {

    this.currentTimeInt = 0;
    this.stopTimer();

    this.timer = setInterval(() => {

      if (!this.is_paused) {

        this.currentTimeInt = this.currentTimeInt + 1;
        this.currentTime = this.formatDuration(this.currentTimeInt);

        let audio_duration = this.audio.duration();

        let duration = this.formatDuration(audio_duration);
        let seekPosition = Math.round(this.audio.seek());

        this.max_song = Math.round(audio_duration);
        this.time_seek = seekPosition;
        this.musicLength = duration;

        if (!this.audio.playing()) {
          this.clearPlayer();
          if (!this.mode_repeat) {
            this.next();
          } else {
            this.playSong(this.current_id_playlist, this.current_id_song);
          }
        }

        this.cd.detectChanges();

      }

    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  clearPlayer(): void {

    if (this.timer != null) {
      clearInterval(this.timer);
    }

    if (this.audio != null) {
      this.audio.stop();
      this.audio = null;
    }

    this.musicLength = '0:00';
    this.currentTime = '0:00';

    this.url_song = "";
    this.title_song = "Cargando canción"
    this.time_seek = 0;
    this.duration = 0;
    this.is_playing = false;
    this.is_paused = false;

    //this.current_id_song = 0;
    //this.current_song_favorite = 0;
  }

  doubleClickSong(id_playlist: number, id_song: number) {
    this.preventSingleClick = true;
    clearTimeout(this.timer);
    this.playSong(id_playlist, id_song);
  }

  playSong(id_playlist: number, id_song: number): void {

    this.current_id_playlist = id_playlist;
    this.current_id_song = id_song;

    let playlists = this.playlists_selected.find((s: { id: any; }) => s.id === id_playlist);

    this.current_playlists = playlists.songs;

    this.clearPlayer();

    this.songsService.reproducirCancion(id_song).subscribe({
      next: (res: any) => {
        const estado = res.estado;
        if (estado == 1) {

          const titulo = res.datos.titulo;
          const favorito = res.datos.favorito;
          const nombre_archivo = res.datos.nombre_archivo;
          const ruta = environment.filesUrl + "/" + nombre_archivo;

          this.title_song = titulo;
          this.current_song_favorite = favorito;

          this.url_song = ruta;

          this.audio = new Howl({
            html5: true,
            src: [this.url_song],
            autoplay: true
          });

          this.is_playing = true;

          this.startTimer();

          this.cd.detectChanges();

        }
      },
      error: error => {
        console.log(error);
      }
    });

  }

  play(): void {
    if (this.is_playing == true) {
      this.is_playing = false;
      this.is_paused = true;
      this.audio.pause();
    } else {
      this.is_playing = true;
      this.is_paused = false;
      this.audio.play();
    }
  }

  findIndexSongPlayer(): number {
    let id = this.current_id_song;
    let list = this.current_playlists;
    let index = 0;
    for (var i = 0; i < list.length; i++) {
      var item: any = list[i];
      if (id == item.id) {
        index = i;
        break;
      }
    }
    return index;
  }

  prev(): void {
    let list = this.current_playlists;
    let index = this.findIndexSongPlayer();
    let previous_index = index - 1;
    if (typeof list[previous_index] !== "undefined") {
      let data_song: any = list[previous_index];
      this.playSong(this.current_id_playlist, data_song.id);
    } else {
      let data_song: any = list[list.length - 1];
      this.playSong(this.current_id_playlist, data_song.id);
    }
  }

  next(): void {
    let list = this.current_playlists;
    let index = this.findIndexSongPlayer();
    let next_index = index + 1;
    if (typeof list[next_index] !== "undefined") {
      let data_song: any = list[next_index];
      this.playSong(this.current_id_playlist, data_song.id);
    } else {
      let data_song: any = list[0];
      this.playSong(this.current_id_playlist, data_song.id);
    }
  }

  repeat(): void {
    if (this.mode_repeat) {
      this.mode_repeat = false;
    } else {
      this.mode_repeat = true;
    }
  }

  onVolumeChange(): void {
    Howler.volume(this.volume / 100);
  }

  onSliderChangeEnd(event: any): void {
    let seekTime = 0;
    seekTime = Math.round(this.time_seek);
    this.cd.detectChanges();
    this.audio.pause();
    this.audio.seek(seekTime);
    this.currentTimeInt = seekTime;
    this.audio.play();
  }

  formatDuration(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    const result_time = String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
    return result_time;
  }

}
