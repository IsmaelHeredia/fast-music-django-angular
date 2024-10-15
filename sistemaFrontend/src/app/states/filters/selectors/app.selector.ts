import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../../app.state';

export const selectAppState = createFeatureSelector<AppState>('filters');

export const selectSongs = createSelector(
  selectAppState,
  (state: AppState) => state.songs
);

export const selectSongName = createSelector(
  selectAppState,
  (state: AppState) => state.song_name
);

export const selectPlaylists = createSelector(
  selectAppState,
  (state: AppState) => state.playlists
);

export const selectStationName = createSelector(
  selectAppState,
  (state: AppState) => state.station_name
);