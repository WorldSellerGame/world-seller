

import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { IGameWorkers } from '../../interfaces';
import { attachments } from './workers.attachments';
import { defaultWorkers } from './workers.functions';

@State<IGameWorkers>({
  name: 'workers',
  defaults: defaultWorkers()
})
@Injectable()
export class WorkersState {

  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(WorkersState, action, handler);
    });
  }

}
