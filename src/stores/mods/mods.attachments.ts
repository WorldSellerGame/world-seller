import { IAttachment } from '../../interfaces/store';
import { CacheMod, SetModioAuthToken, UncacheMod } from './mods.actions';
import { cacheMod, setAuthToken, uncacheMod } from './mods.functions';


export const attachments: IAttachment[] = [
  { action: SetModioAuthToken, handler: setAuthToken },
  { action: CacheMod, handler: cacheMod },
  { action: UncacheMod, handler: uncacheMod }
];
