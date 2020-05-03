import { createAction, createReducer } from '@reduxjs/toolkit';
import { writeConfigRequest } from "secure-electron-store";

export const actions = {
  SET_SETTINGS_OPTION: createAction('SET_SETTINGS_OPTION')
};0

export const INITIAL_STATE = {
  keyIsPressed: false,
  keyToPress: window.api.store.initial()?.['settings[keyToPress]'] || 'w',
  threshold: window.api.store.initial()?.['settings[threshold]'] || {
    speed: 1,
    cpm: 30,
    selected: 'speed'
  }
};

export const reducer = createReducer(INITIAL_STATE, {
  [actions.SET_SETTINGS_OPTION]: (state, action) => {
    const { payload } = action;

    state[payload.id] = payload.value;
    window.api.store.send(writeConfigRequest, `settings[${payload.id}]`, payload.value);
  }
});

export const selectors = {
  getSettings: state => state.settings,
  getKeyIsPressed: state => state.settings.keyIsPressed,
  getKeyToPress: state => state.settings.keyToPress,
  getThreshold: state => state.settings.threshold
};
