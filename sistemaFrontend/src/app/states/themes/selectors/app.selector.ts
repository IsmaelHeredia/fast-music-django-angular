import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../../app.state';

export const selectAppState = createFeatureSelector<AppState>('themes');

export const selectCurrentTheme = createSelector(
  selectAppState,
  (state: AppState) => state.mode
);