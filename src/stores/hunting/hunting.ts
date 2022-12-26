

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { calculateStat, decreaseGatherTimer, setGatheringLocation } from '../../app/helpers';
import { IGameGathering, Stat } from '../../interfaces';
import { CharSelectState } from '../charselect/charselect';
import { TickTimer } from '../game/game.actions';
import { CancelHunting, SetHuntingLocation } from './hunting.actions';
import { attachments } from './hunting.attachments';
import { defaultHunting } from './hunting.functions';

@State<IGameGathering>({
  name: 'hunting',
  defaults: defaultHunting()
})
@Injectable()
export class HuntingState {

  constructor(private store: Store) {
    attachments.forEach(({ action, handler }) => {
      attachAction(HuntingState, action, handler);
    });
  }

  @Selector()
  static level(state: IGameGathering) {
    return state.level;
  }

  @Selector()
  static currentLocation(state: IGameGathering) {
    if(!state.currentLocation) {
      return undefined;
    }

    return { location: state.currentLocation, duration: state.currentLocationDuration };
  }

  @Selector()
  static cooldowns(state: IGameGathering) {
    return state.cooldowns;
  }

  @Action(TickTimer)
  decreaseDuration(ctx: StateContext<IGameGathering>, { ticks }: TickTimer) {
    const equipment = this.store.selectSnapshot(CharSelectState.activeCharacterEquipment);
    const cdrValue = calculateStat(equipment, Stat.HuntingSpeed);
    decreaseGatherTimer(ctx, ticks, cdrValue, CancelHunting);
  }

  @Action(SetHuntingLocation)
  setLocation(ctx: StateContext<IGameGathering>, { location }: SetHuntingLocation) {
    const equipment = this.store.selectSnapshot(CharSelectState.activeCharacterEquipment);
    const gdrValue = calculateStat(equipment, Stat.HuntingPower);
    setGatheringLocation(ctx, location, gdrValue);
  };

}
