

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { calculateStat, decreaseGatherTimer, setGatheringLocation } from '../../app/helpers';
import { AchievementStat, IGameGathering, ItemType, Stat } from '../../interfaces';
import { CharSelectState } from '../charselect/charselect';
import { DecreaseDurability } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelForaging, SetForagingLocation } from './foraging.actions';
import { attachments } from './foraging.attachments';
import { defaultForaging } from './foraging.functions';

@State<IGameGathering>({
  name: 'foraging',
  defaults: defaultForaging()
})
@Injectable()
export class ForagingState {

  constructor(private store: Store) {
    attachments.forEach(({ action, handler }) => {
      attachAction(ForagingState, action, handler);
    });
  }

  @Selector()
  static level(state: IGameGathering) {
    return state.level;
  }

  @Selector()
  static starredNodes(state: IGameGathering) {
    return state.starred || {};
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
    const cdrValue = calculateStat(equipment, Stat.ScytheSpeed);
    const cdrPercent = calculateStat(equipment, Stat.ScytheSpeedPercent);
    const reducedValue = cdrPercent / 100;

    decreaseGatherTimer(ctx, 'foraging', ticks, cdrValue, reducedValue, CancelForaging, AchievementStat.GatherForaging);
  }

  @Action(SetForagingLocation)
  setLocation(ctx: StateContext<IGameGathering>, { location }: SetForagingLocation) {
    const equipment = this.store.selectSnapshot(CharSelectState.activeCharacterEquipment);
    const gdrValue = calculateStat(equipment, Stat.ScythePower);
    const gdrPercent = calculateStat(equipment, Stat.ScythePowerPercent);
    const reducedValue = (gdrPercent / 100) * location.gatherTime;

    setGatheringLocation(ctx, location, gdrValue + reducedValue, 'foraging');
    ctx.dispatch(new DecreaseDurability(ItemType.Scythe));
  };

}
