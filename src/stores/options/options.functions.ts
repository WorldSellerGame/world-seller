import { StateContext } from '@ngxs/store';

import { GameOption, IOptions } from '../../interfaces';
import { SetOption } from './options.actions';


export const defaultOptions: () => IOptions = () => ({
  version: 0,
  [GameOption.DebugMode]: false,
  [GameOption.ColorTheme]: 'worldseller',
  [GameOption.SidebarDisplay]: 'full',
  [GameOption.TickTimer]: 1,
  [GameOption.SoundMaster]: 50,
  [GameOption.SoundSFX]: 100,
  [GameOption.TelemetryErrors]: true,
  [GameOption.TelemetrySavefiles]: true,
  [GameOption.NotificationCorner]: 'left-top',
  [GameOption.ShowNotifications]: true,
});

export function setOption(ctx: StateContext<IOptions>, { option, value }: SetOption) {
  ctx.patchState({ [option]: value });
}
