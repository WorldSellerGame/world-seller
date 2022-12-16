import { IAttachment } from '../../interfaces/store';

import { SetOption } from './options.actions';
import { setOption } from './options.functions';

export const attachments: IAttachment[] = [
  { action: SetOption, handler: setOption }
];
