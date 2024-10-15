import { createReducer, on } from '@ngrx/store';
import { setSongs, setSongName, setPlaylists, setStationName } from '../action/app.action';

export const initialState = {
  songs: [],
  song_name: '',
  playlists: [],
  station_name: ''
};

export const filtersReducer = createReducer(
  initialState,
  on(setSongs, (state, { songs } : { songs: any }) => (
    {
      ...state,
      songs
    }
  )
  ),
  on(setSongName, (state, { song_name }) => (
    {
      ...state,
      song_name
    }
  )
  ),
  on(setPlaylists, (state, { playlists } : { playlists: any }) => (
    {
      ...state,
      playlists
    }
  )
  ),
  on(setStationName, (state, { station_name }) => (
    {
      ...state,
      station_name
    }
  )
  ),
);