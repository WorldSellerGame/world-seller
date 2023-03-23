import { StateContext } from '@ngxs/store';

import { IGameMods } from '../../interfaces';
import { CacheMod, SetModioAuthToken, UncacheMod } from './mods.actions';

export const defaultMods: () => IGameMods = () => ({
  version: 0,
  modioAuthToken: '',
  modioAuthTokenExpires: -1,
  mods: {},
  localMods: []
});

export function resetMods(ctx: StateContext<IGameMods>) {
  ctx.setState(defaultMods());
}

export function setAuthToken(ctx: StateContext<IGameMods>, { token, expiresAt }: SetModioAuthToken) {
  ctx.patchState({ modioAuthToken: token, modioAuthTokenExpires: expiresAt });
}

export function cacheMod(ctx: StateContext<IGameMods>, { modId, modData, isLocal }: CacheMod) {
  const mods = ctx.getState().mods || {};
  mods[modId] = modData;

  const localMods = ctx.getState().localMods || [];
  if(isLocal) {
    localMods.push(modId);
  }

  ctx.patchState({ mods, localMods });
}

export function uncacheMod(ctx: StateContext<IGameMods>, { modId }: UncacheMod) {
  const mods = ctx.getState().mods || {};
  delete mods[modId];

  const localMods = (ctx.getState().localMods || []).filter(id => id !== modId);

  ctx.patchState({ mods, localMods });
}
