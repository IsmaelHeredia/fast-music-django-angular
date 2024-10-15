import { createAction, props } from '@ngrx/store';

export const setSongs = createAction('[setSongs] Update songs', props<{ songs: any[] }>());
export const setSongName = createAction('[setName] Update song name', props<{ song_name: any }>());
export const setPlaylists = createAction('[setPlaylists] Update playlists', props<{ playlists: any[] }>()); 

export const setStationName = createAction('[setStationName] Update station name', props<{ station_name: string }>());