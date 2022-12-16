import { StateContext } from '@ngxs/store';

export interface IAttachment {
  action: any;
  handler: (ctx: StateContext<any>, action?: any) => void;
}
