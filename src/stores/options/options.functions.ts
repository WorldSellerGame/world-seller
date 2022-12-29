import { StateContext } from '@ngxs/store';

import { GameOption, IOptions } from '../../interfaces';
import { SetOption } from './options.actions';


export const defaultOptions: () => IOptions = () => ({
  version: 0,
  [GameOption.DebugMode]: false,
  [GameOption.ColorTheme]: 'dark',
  [GameOption.SidebarDisplay]: 'full',
  [GameOption.TickTimer]: 1
});

export function setOption(ctx: StateContext<IOptions>, { option, value }: SetOption) {
  ctx.patchState({ [option]: value });
}
